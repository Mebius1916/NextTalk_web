import { useSession } from 'next-auth/react';
import { useMessages } from '../lib/useMessages'
import MessageForm from './MessageForm'
import { SessionData } from '../lib/type';
import { useEffect, useRef } from 'react';
interface Message {
  role: string;
  content: string;
}
const MessagesList = () => {
  const { data: session } = useSession();
  const currentUser = session?.user as SessionData; 
  const { messages, isLoadingAnswer } = useMessages() as unknown as {
    messages: Message[];
    isLoadingAnswer: boolean;
  };
  const bottomRef = useRef(null);
  const Bcurrent = bottomRef.current as any
  useEffect(() => {
      Bcurrent?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages,isLoadingAnswer]);
  return (
    <>
    <div className="max-w-3xl mx-auto pt-8 h-[calc(100vh-5.25rem)] overflow-y-auto">
      {messages ?.map((message, i) => {
        const isUser = message.role === 'user'
        if (message.role === 'system') return null
        return (
          <div
            id={`message-${i}`}
            className={`flex mb-4 fade-up ${isUser ? 'justify-end' : 'justify-start'} ${
              i === 1 ? 'max-w-md' : ''
            }`}
            key={message.content}
          >
            {!isUser && (
              <img
                src="/images/robot.svg"
                className="w-9 h-9 rounded-full"
                alt="avatar"
              />
            )}
            <div
              style={{ maxWidth: 'calc(100% - 45px)' }}
              className={`group relative px-3 py-2 rounded-lg ${
                isUser
                  ? 'mr-2 bg-gradient-to-br from-primary-700 to-primary-600 text-white'
                  : 'ml-2 bg-gray-200 text-gray-700'
              }`}
            >
              {message.content.trim()}
            </div>
            {isUser && (
              <img
                src={currentUser?.image || "/images/person.jpg"}
                className="w-9 h-9 rounded-full cursor-pointer"
                alt="avatar"
              />
            )}
          </div>
        )
      })}
      {isLoadingAnswer && (
        <div className="flex justify-start mb-4">
          <img
            src="/images/robot.svg"
            className="w-9 h-9 rounded-full"
            alt="avatar"
          />
          <div className="loader ml-2 p-2.5 px-4 bg-gray-200 rounded-full space-x-1.5 flex justify-between items-center relative">
            <span className="block w-3 h-3 rounded-full"></span>
            <span className="block w-3 h-3 rounded-full"></span>
            <span className="block w-3 h-3 rounded-full"></span>
          </div>
        </div>
      )}
      <div ref={bottomRef} className='pb-4'/>
    </div>
    <div className=" bottom-0 right-0 left-0 h-12">
      <MessageForm />
    </div>
  </>
  )
}

export default MessagesList
