import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import RootLayout from "./layouts/RootLayout.tsx"
import HomePage from "./pages/HomePage.tsx"
import CreateServerModal from "./components/modals/CreateServerModal.tsx"
import { ApolloProviderWithAuth } from "./providers/ApolloProviderWithAuth"
import ServerLayout from "./layouts/ServerLayout.tsx"
import CreateChannelModal from "./components/modals/server/CreateChannelModal.tsx"
import ChannelLayout from "./layouts/ChannelLayout.tsx"
import ChannelPage from "./pages/ChannelPage.tsx"
import InviteModal from "./components/modals/server/InviteModal.tsx"
import UpdateServerModal from "./components/modals/server/UpdateServerModal.tsx"
import DeleteChannelModal from "./components/modals/server/channel/DeleteChannelModal.tsx"
import DeleteServerModal from "./components/modals/server/DeleteServerModal.tsx"
import ServerJoinModal from "./components/modals/server/ServerJoinModal.tsx"
import ManageMemberModal from "./components/modals/member/ManageMemberModal.tsx"
import ConversationPage from "./pages/ConversationPage.tsx"
import UpdatMessageModal from "./components/modals/server/chat/UpdateMessageModal.tsx"
import LeaveServerModal from "./components/modals/server/LeaverServerModal.tsx"
import "@livekit/components-styles"
import { useGeneralStore } from "./stores/generalStore"
import { useProfileStore } from "./stores/profileStore"
import { useSubscription } from "@apollo/client"
import { MESSAGE_CREATED } from "./graphql/subscriptions/MessageCreated"
import { MessageCreatedSubscription, MessageCreatedSubscriptionVariables } from "./gql/graphql"

// Global message subscription for unread tracking
function GlobalMessageSubscription() {
  const incrementUnreadChannel = useGeneralStore((state) => state.incrementUnreadChannel)
  const incrementUnreadDM = useGeneralStore((state) => state.incrementUnreadDM)
  const profileId = useProfileStore((state) => state.profile?.id)

  useSubscription<MessageCreatedSubscription, MessageCreatedSubscriptionVariables>(
    MESSAGE_CREATED,
    {
      variables: {
        conversationId: null,
        channelId: null,
      },
      onSubscriptionData: ({ subscriptionData }) => {
        const message = subscriptionData.data?.messageCreated?.message
        if (!message || message.member.profileId === profileId) return

        if ('channelId' in message) {
          // Channel message
          incrementUnreadChannel(Number(message.channelId))
        } else if ('conversationId' in message) {
          // DM message
          incrementUnreadDM(message.member.id)
        }
      },
    }
  )

  return null
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

const RouterComponent = () => {
  return (
    <Routes>
      <Route path="" element={<RootLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <GlobalMessageSubscription />
              <ServerJoinModal />
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="servers/:serverId" element={<ServerLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <GlobalMessageSubscription />
              <CreateChannelModal />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="servers/:serverId/channels/:channelType/:channelId"
        element={<ChannelLayout />}
      >
        <Route
          index
          element={
            <ProtectedRoute>
              <GlobalMessageSubscription />
              <LeaveServerModal />
              <UpdatMessageModal />
              <ManageMemberModal />
              <ServerJoinModal />
              <DeleteServerModal />
              <DeleteChannelModal />
              <CreateChannelModal />
              <UpdateServerModal />
              <CreateChannelModal />
              <InviteModal />
              <ChannelPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="servers/:serverId/conversations/:conversationId/members/:channelType/:memberId"
        element={<ChannelLayout />}
      >
        <Route
          index
          element={
            <ProtectedRoute>
              <GlobalMessageSubscription />
              <LeaveServerModal />
              <UpdatMessageModal />
              <ManageMemberModal />
              <ServerJoinModal />
              <DeleteServerModal />
              <DeleteChannelModal />
              <CreateChannelModal />
              <UpdateServerModal />
              <CreateChannelModal />
              <InviteModal />
              <ConversationPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <MantineProvider>
        <ApolloProviderWithAuth>
          <BrowserRouter>
            <CreateServerModal />
            <RouterComponent />
          </BrowserRouter>
        </ApolloProviderWithAuth>
      </MantineProvider>
    </ClerkProvider>
  </React.StrictMode>
)

export default RouterComponent
