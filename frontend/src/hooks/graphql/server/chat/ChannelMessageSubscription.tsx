import { useApolloClient, useSubscription } from "@apollo/client"
import { MESSAGE_CREATED } from "../../../../graphql/subscriptions/MessageCreated"
import { GET_MESSAGES } from "../../../../graphql/queries/GetMessages"
import { MessageCreatedSubscription, MessageCreatedSubscriptionVariables, GetMessagesQuery } from "../../../../gql/graphql"
import { useGeneralStore } from "../../../../stores/generalStore"
import { useParams } from "react-router-dom"

export function ChannelMessageSubscription({ channelId }: { channelId: number }) {
  const { cache } = useApolloClient()
  const { channelId: activeChannelId } = useParams()
  const incrementUnreadChannel = useGeneralStore((state) => state.incrementUnreadChannel)

  useSubscription<MessageCreatedSubscription, MessageCreatedSubscriptionVariables>(MESSAGE_CREATED, {
    variables: { channelId },
    onSubscriptionData: ({ subscriptionData }) => {
      const newMessage = subscriptionData.data?.messageCreated
      if (!newMessage) return
      const cachedData = cache.readQuery<GetMessagesQuery>({
        query: GET_MESSAGES,
        variables: { channelId },
      })
      if (cachedData && cachedData.getMessages.messages) {
        const timestamp = String(new Date(newMessage.message?.updatedAt).getTime())
        const messageWithTimestamp = {
          ...newMessage.message,
          updatedAt: timestamp,
        }
        const updatedMessages = [...cachedData.getMessages.messages, messageWithTimestamp]
        cache.writeQuery<GetMessagesQuery>({
          query: GET_MESSAGES,
          variables: { channelId },
          data: { getMessages: { messages: updatedMessages } },
        })
      }
      if (String(channelId) !== activeChannelId) {
        incrementUnreadChannel(channelId)
      }
    },
    skip: !channelId,
  })

  return null
} 