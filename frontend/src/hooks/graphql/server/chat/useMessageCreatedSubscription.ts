import { useApolloClient, useSubscription } from "@apollo/client"
import { useParams } from "react-router-dom"
import { MESSAGE_CREATED } from "../../../../graphql/subscriptions/MessageCreated"
import {
  GetMessagesQuery,
  MessageCreatedSubscription,
  MessageCreatedSubscriptionVariables,
} from "../../../../gql/graphql"
import { useEffect } from "react"
import { GET_MESSAGES } from "../../../../graphql/queries/GetMessages"
import { useGeneralStore } from "../../../../stores/generalStore"
import { useProfileStore } from "../../../../stores/profileStore"

export const useMessageCreatedSubscription = () => {
  const { cache } = useApolloClient()

  const { conversationId: convId, channelId: channId } = useParams()

  const conversationId = convId ? parseInt(convId) : null
  const channelId = channId ? parseInt(channId) : null

  const incrementUnreadDM = useGeneralStore((state) => state.incrementUnreadDM)
  const profileId = useProfileStore((state) => state.profile?.id)

  const { data: dataMessageCreated } = useSubscription<
    MessageCreatedSubscription,
    MessageCreatedSubscriptionVariables
  >(MESSAGE_CREATED, {
    variables: {
      conversationId,
      channelId,
    },
    onError: (err) => {
      console.log(err)
    },
  })

  // Separate subscription for all DM notifications
  const { data: allDMMessages } = useSubscription<
    MessageCreatedSubscription,
    MessageCreatedSubscriptionVariables
  >(MESSAGE_CREATED, {
    variables: {
      conversationId: null,
      channelId: null,
    },
    onError: (err) => {
      console.log(err)
    },
  })

  useEffect(() => {
    const newMessage = dataMessageCreated?.messageCreated
    console.log("newMesage", newMessage)
    const cachedData = cache.readQuery<GetMessagesQuery>({
      query: GET_MESSAGES,
      variables: {
        conversationId,
        channelId,
      },
    })

    if (cachedData && cachedData.getMessages.messages && newMessage) {
      const timestamp = String(
        new Date(
          dataMessageCreated?.messageCreated?.message?.updatedAt
        ).getTime()
      )
      const newMessage = {
        ...dataMessageCreated?.messageCreated?.message,
        updatedAt: timestamp,
      }
      const updatedMessages = [...cachedData.getMessages.messages, newMessage]

      cache.writeQuery<GetMessagesQuery>({
        query: GET_MESSAGES,
        variables: {
          conversationId,
          channelId,
        },
        data: {
          getMessages: {
            messages: updatedMessages,
          },
        },
      })
    }
  }, [
    cache,
    channelId,
    conversationId,
    dataMessageCreated?.messageCreated,
    dataMessageCreated?.messageCreated?.message,
  ])

  // Handle DM notifications
  useEffect(() => {
    const dmMessage = allDMMessages?.messageCreated?.message
    if (
      dmMessage &&
      'conversationId' in dmMessage &&
      dmMessage.member.profileId !== profileId &&
      (!conversationId || String(conversationId) !== String(dmMessage.conversationId))
    ) {
      // Find the other member in the conversation to increment their unread count
      // For now, we'll use a simple approach - increment for the conversation
      // This will be refined when we have better conversation tracking
      incrementUnreadDM(dmMessage.member.id)
    }
  }, [allDMMessages, conversationId, profileId, incrementUnreadDM])
}
