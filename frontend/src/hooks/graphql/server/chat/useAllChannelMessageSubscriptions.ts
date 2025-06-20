import { useServer } from "../useServer"

export function useAllChannelIds() {
  const { textChannels, audioChannels, videoChannels } = useServer()
  return [...textChannels, ...audioChannels, ...videoChannels].map(c => c.id)
} 