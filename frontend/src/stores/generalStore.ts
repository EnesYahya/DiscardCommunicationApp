import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ChannelType } from "../gql/graphql"

export type Modal =
  | "CreateServer"
  | "InvitePeople"
  | "UpdateServer"
  | "CreateChannel"
  | "ManageMembers"
  | "DeleteChannel"
  | "UpdateChannel"
  | "DeleteServer"
  | "ServerJoin"
  | "UpdateMessage"
  | "LeaveServer"

interface GeneralStore {
  activeModal: Modal | null
  drawerOpen: boolean
  chanelTypeForCreateChannelModal: ChannelType | undefined
  channelToBeDeletedOrUpdatedId: number | null

  // Unread tracking
  unreadChannels: Record<number, number> // channelId -> count
  unreadDMs: Record<number, number> // memberId -> count

  setActiveModal: (modal: Modal | null) => void
  toggleDrawer: () => void
  setChannelTypeForCreateChannelModal: (type: ChannelType | undefined) => void
  setChannelToBeDeletedOrUpdatedId: (id: number | null) => void

  // Unread methods
  incrementUnreadChannel: (channelId: number) => void
  markChannelRead: (channelId: number) => void
  incrementUnreadDM: (memberId: number) => void
  markDMRead: (memberId: number) => void
}

export const useGeneralStore = create<GeneralStore>()(
  persist(
    (set) => ({
      activeModal: null,
      drawerOpen: true,
      chanelTypeForCreateChannelModal: ChannelType.Text,
      channelToBeDeletedOrUpdatedId: null,
      unreadChannels: {},
      unreadDMs: {},
      setActiveModal: (modal: Modal | null) => set({ activeModal: modal }),
      toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),

      setChannelTypeForCreateChannelModal: (channeltype) =>
        set(() => ({ chanelTypeForCreateChannelModal: channeltype })),

      setChannelToBeDeletedOrUpdatedId: (id) =>
        set(() => ({ channelToBeDeletedOrUpdatedId: id })),

      incrementUnreadChannel: (channelId) =>
        set((state) => ({
          unreadChannels: {
            ...state.unreadChannels,
            [channelId]: (state.unreadChannels[channelId] || 0) + 1,
          },
        })),

      markChannelRead: (channelId) =>
        set((state) => {
          const { [channelId]: _, ...rest } = state.unreadChannels // eslint-disable-line @typescript-eslint/no-unused-vars
          return { unreadChannels: rest }
        }),

      incrementUnreadDM: (memberId) =>
        set((state) => ({
          unreadDMs: {
            ...state.unreadDMs,
            [memberId]: (state.unreadDMs[memberId] || 0) + 1,
          },
        })),

      markDMRead: (memberId) =>
        set((state) => {
          const { [memberId]: _, ...rest } = state.unreadDMs // eslint-disable-line @typescript-eslint/no-unused-vars
          return { unreadDMs: rest }
        }),
    }),
    {
      name: "general-store",
    }
  )
)
