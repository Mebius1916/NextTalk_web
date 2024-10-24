import MessagesList from '../components/MessageList'
import { MessagesProvider } from '../lib/useMessages'
import Layout from '../components/Layout'
import ChatLayout from '../components/ChatLayout'

const IndexPage = () => {
  return (
    <MessagesProvider>
      <Layout>
        <div >
          <MessagesList />
        </div>
      </Layout>
    </MessagesProvider>
  )
}

IndexPage.getLayout = function getLayout(page:any) {
  return (
    <ChatLayout>
      {page}
    </ChatLayout>
  )
}
export default IndexPage
