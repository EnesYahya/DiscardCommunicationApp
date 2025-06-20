import { useMutation } from "@apollo/client"
import { useProfileStore } from "../../../../stores/profileStore"
import {
  CreateAccessTokenMutation,
  CreateAccessTokenMutationVariables,
} from "../../../../gql/graphql"
import { CREATE_ACCESS_TOKEN } from "../../../../graphql/mutations/server/media/CreateAccessToken"
import { useEffect } from "react"

export const useLivekitAccessToken = (channelId: string | undefined) => {
  const profile = useProfileStore((state) => state.profile)
  console.log("Profile in store:", profile)
  const identity = profile?.name || profile?.email || String(profile?.id || "")
  console.log("useLivekitAccessToken identity:", identity, "channelId:", channelId)

  const [createToken, { data, loading }] = useMutation<
    CreateAccessTokenMutation,
    CreateAccessTokenMutationVariables
  >(CREATE_ACCESS_TOKEN, {
    variables: {
      identity,
      chatId: channelId ? channelId.toString() : "",
    },
  })

  useEffect(() => {
    if (identity && channelId) {
      createToken()
    }
  }, [createToken, channelId, identity])

  return { token: data?.createAccessToken, loading }
}
