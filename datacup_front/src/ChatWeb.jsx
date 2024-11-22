import React, { useState } from "react";

function ChatWeb() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const onSend = () => {
    if (!text.trim()) return;
    const newMessage = {
      _id: messages.length + 1,
      text: text.trim(),
      createdAt: new Date(),
      user: { _id: 1, name: "User" },
    };
    setMessages([...messages, newMessage]);
    setText("");

    // Simulate bot reply
    setTimeout(() => {
      const botMessage = {
        _id: messages.length + 2,
        text: "Hello! How can I assist you?",
        createdAt: new Date(),
        user: { _id: 2, name: "Bot" },
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-4 overflow-y-auto mt-10">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-4 flex ${
              msg.user._id === 1 ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                msg.user._id === 1
                  ? "bg-blue-500 text-white mr-20"
                  : "bg-gray-200 text-black ml-20"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>


      <div className="p-4 bg-white flex">
        <input
          type="text"
          className="flex-grow border rounded-lg p-2 mr-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>


  );
}

export default ChatWeb;