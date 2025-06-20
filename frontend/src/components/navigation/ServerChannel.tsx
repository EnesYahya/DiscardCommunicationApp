import React from "react"
import { Channel, ChannelType, MemberRole, Server } from "../../gql/graphql"
import {
  IconCamera,
  IconHash,
  IconMessage,
  IconMicrophone,
  IconTrash,
} from "@tabler/icons-react"
import { useModal } from "../../hooks/useModal"
import { useNavigate } from "react-router-dom"
import { NavLink, Stack, rem, Badge } from "@mantine/core"
import { useGeneralStore } from "../../stores/generalStore"

type ServerChannelProps = {
  channel: Channel
  server: Server
  role?: MemberRole
  isActive?: boolean
}

const iconMap = {
  [ChannelType.Text]: <IconHash size={15} />,
  [ChannelType.Audio]: <IconMicrophone size={15} />,
  [ChannelType.Video]: <IconCamera size={15} />,
}

function ServerChannel({
  channel,
  server,
  role,
  isActive,
}: ServerChannelProps) {
  const deleteChannelModal = useModal("DeleteChannel")
  const updateChannelModal = useModal("UpdateChannel")

  const setChannelToBeDeletedOrUpdatedId = useGeneralStore(
    (state) => state.setChannelToBeDeletedOrUpdatedId
  )

  const navigate = useNavigate()
  const { incrementUnreadChannel, markChannelRead, unreadChannels } = useGeneralStore((state) => ({
    incrementUnreadChannel: state.incrementUnreadChannel,
    markChannelRead: state.markChannelRead,
    unreadChannels: state.unreadChannels,
  }))

  if (!channel && !server) return null
  const Icon = iconMap[channel.type]
  return (
    <NavLink
      onClick={() => {
        navigate(
          `/servers/${server.id}/channels/${channel.type}/${channel.id}`
        )
        markChannelRead(channel.id)
      }}
      ml="md"
      w={rem(260)}
      label={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {channel?.name}
          {unreadChannels[channel.id] && (
            <Badge color="red" size="xs" ml={8}>
              {unreadChannels[channel.id]}
            </Badge>
          )}
        </span>
      }
      rightSection={Icon}
      active={isActive}
    >
      {role !== MemberRole.Guest && channel?.name !== "general" && (
        <Stack>
          <NavLink
            label="Join"
            rightSection={
              <IconMessage style={{ marginLeft: "rem(8px)" }} size={20} />
            }
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/servers/${server.id}/channels/${channel.type}/${channel.id}`
              )
            }}
          />
          <NavLink
            label="Delete"
            rightSection={
              <IconTrash style={{ marginLeft: "rem(8px)" }} size={20} />
            }
            onClick={(e) => {
              e.stopPropagation();
              setChannelToBeDeletedOrUpdatedId(channel.id)
              deleteChannelModal.openModal()
            }}
          />
        </Stack>
      )}
    </NavLink>
  )
}

export default ServerChannel
