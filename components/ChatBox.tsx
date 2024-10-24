"use client"
import React, { useEffect, useState } from 'react'
import { SessionData } from '../lib/type';
import { differenceInDays, format, isSameDay } from 'date-fns';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

type ChatBox = {
  chat: any,
  currentUser: SessionData,
  currentChatId: string
}
const ChatBox = ({ chat, currentUser, currentChatId }: ChatBox) => {
  //从allChat数组中剔除自己
  const otherMembers = chat?.members?.filter(
    (member: SessionData) => member._id !== currentUser._id
  );
  const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];
  const router = useRouter();
  // console.log(lastMessage?.isSeen)
  const [isSeen,setIsSeen] = useState(lastMessage?.isSeen);
  const [isShow,setIsShow] = useState(lastMessage&&lastMessage?.sender?._id!==currentUser._id &&!isSeen);
  const read = () => {
    const readMessage = async () => {
      try {
        const res = await fetch(`/api/messages/read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: chat._id,
          }),
        });
        const data = await res.json();
        setIsSeen(true);
        setIsShow(false);
      } catch (error) {
        console.log(error);
      }
    };
    readMessage();
  };

  useEffect(() => {
    setIsShow(lastMessage&&lastMessage?.sender?._id!==currentUser._id &&!isSeen);
    setIsSeen(isShow);
  }, [lastMessage]);


  
function displayTime(createdAt:string) {
  const createdAtDate = new Date(createdAt);
  const now = new Date();

  if (isSameDay(createdAtDate, now)) {
    // 获取小时数
    const hour = createdAtDate.getHours();
    // 根据小时数判断是AM还是PM
    const ampm = hour < 12 ? 'AM' : 'PM';
    // 格式化时间，小时数使用24小时制
    const time = format(createdAtDate, "HH:mm");
    // 返回时间字符串，包括AM/PM标识
    return `${time} ${ampm}`;
  } else {
    // 如果不在同一天内，显示几天前
    const daysAgo = differenceInDays(now, createdAtDate);
    return `${daysAgo} days ago`;
  }
}
  return (
    <Link href={`/chats/toChat/${chat._id}`} onClick={read}>
      <div
        className=
        {`flex items-start justify-between  cursor-pointer hover:bg-grey-2 w-full h-14
      bg-white mb-2 
        ${chat._id === currentChatId ? "drop-shadow-md border-l-3 border-secondary" : ""}`}

      >
        <div className="flex gap-2 ">
          {chat?.isGroup ? (
            <img
              src={chat?.groupPhoto || "/images/group.png"}
              alt="group-photo"
              className="w-10 h-10 rounded-full object-cover object-center mt-2 ml-2"

            />
          ) : (
            <img
              src={otherMembers[0].image || "/images/person.jpg"}
              alt="profile-photo"
              className="w-10 h-10 rounded-full object-cover object-center mt-2 ml-2"
            />
          )}

          <div className="flex flex-col ">
            {chat?.isGroup ? (
              <p className="text-base-bold text-small mt-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-32">{chat?.name || "group"}</p>
            ) : (
              <p className="text-base-bold text-small mt-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-32">{otherMembers[0]?.username}</p>
            )}

            {!lastMessage && <p className="text-smm text-grey-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-32">Started a chat</p>}

            {lastMessage?.photo ? (
              lastMessage?.sender?._id === currentUser._id ? (
                <p className="text-smm text-grey-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-32">You sent a photo</p>
              ) : (
                <p
                  className="text-smm text-grey-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-32"
                >
                  Received a photo
                </p>
              )
            ) : (
              
                <p
                  className="last-message whitespace-nowrap overflow-hidden text-ellipsis text-small text-grey-3 max-w-32"
                >
                  {lastMessage?.text}
                </p>
                
  
            )}
          </div>
        </div>

        <div className='relative'>
          <p className="text-base-light text-grey-3 text-smm mr-2 mt-2">
            {!lastMessage
              ? displayTime(chat?.createdAt)
              : displayTime(chat?.lastMessageAt)}
              {
                isShow ?
                 <img src='/images/isSeen.svg' className='w-4 h-4 mt-1'/> : null

              }

          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChatBox;
