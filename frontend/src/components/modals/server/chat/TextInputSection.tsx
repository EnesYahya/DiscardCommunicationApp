import React from "react"
import { ChannelType } from "../../../../gql/graphql"
import { useParams } from "react-router-dom"
import { useForm } from "@mantine/form"
import { MutationFunctionOptions } from "@apollo/client"
import { Button, FileInput, Flex, Image, TextInput, rem } from "@mantine/core"
import classes from "./TextInputSection.module.css"
import { IconCubeSend, IconFile, IconX } from "@tabler/icons-react"

type CreateMessageMutation = (
  options?: MutationFunctionOptions
) => Promise<any>

interface Props {
  conversationId?: number
  channelId?: number
  createMessage: CreateMessageMutation
}

function TextInputSection({ conversationId, channelId, createMessage }: Props) {
  const fileInputRef = React.useRef<HTMLButtonElement>(null)

  const { channelType } = useParams<{ channelType: string }>()

  const isMediaChannel =
    ChannelType.Video === channelType || ChannelType.Audio === channelType

  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)

  const createImagePreview = (file: File) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setFile(file)
    }
  }

  const form = useForm({
    initialValues: {
      content: "",
    },
  })

  const handleSendMessage = async () => {
    if ((!form.values.content && !file) || (!conversationId && !channelId))
      return

    await createMessage({
      variables: {
        content: form.values.content,
        conversationId: conversationId,
        channelId: channelId,
        file: file,
      },
      refetchQueries: ["GetMessages"],
      onError: (error) => {
        console.log(error)
      },
      onCompleted: () => {
        form.setValues({ content: "" })
        setImagePreview(null)
        setFile(null)
      },
    })
  }

  return (
    <Flex direction="column" w="100%" gap="md" align="center">
      {imagePreview && (
        <Flex
          w="100%"
          style={{
            position: "relative",
          }}
          justify="flex-start"
          align="center"
          mb="md"
        >
          <Image
            w={rem(100)}
            h={rem(100)}
            src={imagePreview}
            style={{ borderRadius: "10%" }}
            fit="cover"
          />
          <Button
            onClick={() => {
              setImagePreview(null)
              setFile(null)
            }}
            color="red"
            pos="absolute"
            size="25"
            radius={100}
            m="0"
            p="0"
            left={80}
            top={-5}
            style={{ zIndex: 10 }}
          >
            <IconX radius={100} />
          </Button>
        </Flex>
      )}
      <Flex w="100%" gap="md" align="center">
        <TextInput
          style={{ flex: 1 }}
          placeholder={"Message"}
          {...form.getInputProps("content")}
        />
        <Flex align="center" gap="md">
          {!imagePreview && (
            <Button
              variant="light"
              radius={100}
              w={rem(50)}
              h={rem(50)}
              p="xs"
              size="compact-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileInput
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={createImagePreview}
                value={file}
              />
              <IconFile size={25} />
            </Button>
          )}

          <Button
            p="xs"
            radius={100}
            variant="light"
            size="50"
            onClick={handleSendMessage}
          >
            <IconCubeSend size="25" />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TextInputSection
