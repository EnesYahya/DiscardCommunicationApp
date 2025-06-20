import React, { useMemo } from "react"
import { ApolloProvider, ApolloClient, InMemoryCache, ApolloLink, split } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"
import { getMainDefinition } from "@apollo/client/utilities"
import { createUploadLink } from "apollo-upload-client"
import { WebSocketLink } from "@apollo/link-ws"
import { useSession, useUser } from "@clerk/clerk-react"
import { Loader, Center } from "@mantine/core"

const httpUri = "http://localhost:3000/graphql"
const wsUri = "ws://localhost:3000/graphql"

export const ApolloProviderWithAuth = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoaded } = useSession()
  const { isLoaded: userLoaded } = useUser()

  // Function to always get the latest token
  const getToken = async () => {
    if (!session) return ""
    return await session.getToken({ template: "backend-jwt-with-email" })
  }

  const client = useMemo(() => {
    if (!isLoaded || !userLoaded) return null

    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken()
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
          "apollo-require-preflight": "true",
        },
      }
    })

    const wsLink = new WebSocketLink({
      uri: wsUri,
      options: {
        reconnect: true,
        connectionParams: async () => {
          const token = await getToken()
          return {
            headers: {
              authorization: token ? `Bearer ${token}` : "",
            },
          }
        },
      },
    })

    const uploadLink = createUploadLink({
      uri: httpUri,
      credentials: "include",
    })

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        })
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`)
      }
    })

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        )
      },
      wsLink,
      ApolloLink.from([errorLink, authLink, uploadLink])
    )

    const cache = new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getMessages: {
              merge(existing, incoming) {
                return incoming
              },
            },
          },
        },
      },
    })

    return new ApolloClient({
      link: splitLink,
      cache,
    })
  }, [session, isLoaded, userLoaded])

  if (!isLoaded || !userLoaded || !client) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    )
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}