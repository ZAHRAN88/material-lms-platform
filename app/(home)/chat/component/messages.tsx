"use client"
import React, { useEffect, useState } from "react";
import Markdown from "./markdown";
import { Bot, User2 } from "lucide-react";
import { Message } from "ai/react";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const Messages = ({ messages, isLoading }: Props) => {
  


  return (
    <div id="chatbox" className="flex p-5 flex-col w-full mt-4 gap-4">
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        const isLastMessage = index === messages.length - 1;

        return (
          <div
            key={index}
            className={`
              "flex items-start  gap-4 p-4 rounded-lg  "relative ml-10" shadow-sm",
              ${isUser ? " w-fit justify-start" : ""}
            `}
          >
            {isUser ? (
              <User2 className="absolute left-[-2.5rem] top-2 h-6 w-6 text-gray-500" />
            ) : (
              <div className="flex justify-start w-[9em] rounded-md p-3 bg-[#2f428a] gap-4">
                <Bot
                className={`
                  "absolute left-[0] top-2 text-[#fff]  h-6 w-6 text-blue-500",
                ${  isLoading && isLastMessage ? "animate-bounce" : ""}
                `}
              />
              <h2 className=" text-wrap text-white ">
                AC Bot
              </h2>
              </div>
            )}
            <div className="flex-1 text-[#021F83] ">
              <Markdown text={message.content} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
