import { app, auth, db, storage } from "@/lib/firebase"
import style from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  Sidebar,
} from "@chatscope/chat-ui-kit-react"
import axios from "axios"
import { onAuthStateChanged } from "firebase/auth"
import { onValue, push, ref, set } from "firebase/database"
import {
  ref as refStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import Layout from "@/components/Layout"

const ChatPage = () => {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [senderId, setSenderId] = useState("")
  const [receiverId, setReceiverId] = useState("")
  const adminid = "ATIRAoZVTfQPAtkvn9CNEEkIqbF3"
  const url = `messages`
  const [selectedChat, setSelectedChat] = useState(null)
  const urlChat = `messages/${selectedChat?.senderId}/${selectedChat?.receiverId}`

  const handleSendMessage = (message) => {
    if (message.trim() === "") {
      return
    }

    const messagesRef = ref(db, urlChat)
    const newMessageRef = push(messagesRef)
    set(newMessageRef, {
      nama_pengirim: "Admin",
      nama_penerima: selectedChat?.receiverName,
      pesan: message,
      tanggal: new Date().toISOString(),
      sender_id: selectedChat?.receiverId,
      receiver_id: selectedChat?.senderId,
      isFile: false,
    })

    setNewMessage("")
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        axios
          .get("/api/auth?userId=" + user.uid)
          .then((res) => setIsLoggedIn(res.data))
        // User is signed in
        // Redirect to protected routes or display logged-in content
      } else {
        return router.replace("/")
        // User is not signed in
        // Redirect to login or registration page
      }
    })

    const conversationsRef = ref(db, url)
    onValue(conversationsRef, (snapshot) => {
      const conversationsData = snapshot.val()
      if (conversationsData) {
        const conversationsList = Object.entries(conversationsData).map(
          ([key, value]) => {
            const conv = Object.values(value)
            if (conv.length > 0) {
              const conversation = Object.values(conv[0]).pop()
              return {
                id: key,
                senderId: conversation.sender_id,
                receiverId: conversation.receiver_id,
                senderName: conversation.nama_pengirim,
                receiverName: conversation.nama_penerima,
                lastMessage: conversation.pesan,
              }
            }
          }
        )
        setConversations(conversationsList)
      } else {
        setConversations([])
      }
    })
  }, [])

  useEffect(() => {
    const messagesRef = ref(
      db,
      `messages/${selectedChat?.senderId}/${selectedChat?.receiverId}`
    )
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val()
      if (messagesData) {
        const messagesArray = Object.values(messagesData)
        setMessages(messagesArray)
      } else {
        setMessages([])
      }
    })
  }, [selectedChat])

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const storageRef = refStorage(storage, `uploads/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.error("snapshot", snapshot)
          // Handle progress if needed
        },
        (error) => {
          console.error("File upload error:", error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          console.log(downloadURL, "downloadURL")

          const messagesRef = ref(db, urlChat)
          const newMessageRef = push(messagesRef)
          set(newMessageRef, {
            nama_pengirim: "Admin",
            nama_penerima: selectedChat?.receiverName,
            pesan: "Mengirim Sebuah File, Klik Untuk Download",
            fileUrl: downloadURL,
            isFile: true,
            tanggal: new Date().toISOString(),
            sender_id: selectedChat?.receiverId,
            receiver_id: selectedChat?.senderId,
          })

          setNewMessage("")
          // await addDoc(collection(db, "files"), {
          //   name: file.name,
          //   url: downloadURL,
          //   createdAt: new Date(),
          // })
          // setMessages([
          //   ...messages,
          //   {
          //     text: `File uploaded: ${file.name}`,
          //     url: downloadURL,
          //     direction: "outgoing",
          //   },
          // ])
        }
      )
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  console.log("messages", messages)
  console.log("conversations", conversations)
  return (
    <Layout>
      <div style={{ height: "100vh" }}>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <MainContainer>
          <Sidebar position="left">
            <ConversationList>
              {conversations.map((item) => {
                return (
                  <Conversation
                    key={item}
                    name={item?.senderName}
                    lastSenderName={item?.senderName}
                    info={item?.lastMessage}
                    active={selectedChat?.id === item?.id}
                    onClick={(e) => setSelectedChat(item)}
                  >
                    <Avatar src="https://yt3.ggpht.com/yti/ANjgQV8JjOe0eDlu8qZbNN1SJ3Li_FtynE54MsLpQA=s88-c-k-c0x00ffffff-no-rj" />
                  </Conversation>
                )
              })}
            </ConversationList>
          </Sidebar>
          <ChatContainer>
            <ConversationHeader>
              <Avatar src="https://yt3.ggpht.com/yti/ANjgQV8JjOe0eDlu8qZbNN1SJ3Li_FtynE54MsLpQA=s88-c-k-c0x00ffffff-no-rj" />
              <ConversationHeader.Content userName={selectedChat?.senderName} />
            </ConversationHeader>

            <MessageList>
              {messages.map((item, index) => {
                if (item?.sender_id === selectedChat?.senderId) {
                  return (
                    <Message
                      key={index}
                      model={{
                        message: item?.pesan,
                        sender: item?.nama_pengirim,
                        sentTime: item?.tanggal,
                        direction: "incoming",
                        position: "single",
                      }}
                      onClick={() => {
                        if (item?.isFile) {
                          window.open(item?.fileUrl, "_blank")
                        }
                      }}
                    ></Message>
                  )
                }
                return (
                  <Message
                    key={index}
                    model={{
                      message: item?.pesan,
                      sender: item?.nama_penerima,
                      sentTime: item?.tanggal,
                      direction: "outgoing",
                      position: "single",
                    }}
                    onClick={() => {
                      if (item?.isFile) {
                        window.open(item?.fileUrl, "_blank")
                      }
                    }}
                  ></Message>
                )
              })}
            </MessageList>

            <MessageInput
              placeholder="Type message here"
              onSend={handleSendMessage}
              value={newMessage}
              onChange={(e) => setNewMessage(e)}
              onAttachClick={handleAttachClick}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </Layout>
  )
}

export default ChatPage
