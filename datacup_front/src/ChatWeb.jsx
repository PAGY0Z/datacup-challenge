import React, { useState, useRef, useEffect } from "react";

function ChatWeb() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Référence pour le défilement
  const messagesEndRef = useRef(null);

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Appeler scrollToBottom à chaque ajout de message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);





  const sendToApi = async (userMessage) => {
    try {
      // Envoyer le message utilisateur à l'API
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
  
      // Vérifiez si la réponse est OK
      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de l'appel API.");
      }
  
      // Parsez la réponse JSON
      const data = await response.json();
  
      // Ajoutez la réponse du bot aux messages
      const botMessage = {
        _id: messages.length + 2,
        text: data.message, // Supposez que l'API retourne une clé "message"
        createdAt: new Date(),
        user: { _id: 2, name: "Bot" },
      };
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
  
      // Message d'erreur par le bot
      const errorMessage = {
        _id: messages.length + 2,
        text: "Désolé, une erreur est survenue. Veuillez réessayer.",
        createdAt: new Date(),
        user: { _id: 2, name: "Bot" },
      };
  
      setMessages((prev) => [...prev, errorMessage]);
  
      // Remettre le dernier message utilisateur dans l'input
      setText(userMessage);
    } finally {
      setIsTyping(false);
    }
  };

  




  const onSend = async () => {
    if (!text.trim()) return;

    const newMessage = {
      _id: messages.length + 1,
      text: text.trim(),
      createdAt: new Date(),
      user: { _id: 1, name: "User" },
    };

    setMessages([...messages, newMessage]);
    setText("");

    // Simulate bot typing
    setIsTyping(true);

    await sendToApi(newMessage.text);
    //setTimeout(() => {
    //  const botMessage = {
    //    _id: messages.length + 2,
    //    text: "Bonjour, comment puis-je vous aider ?",
    //    createdAt: new Date(),
    //    user: { _id: 2, name: "Bot" },
    //  };
    //  setMessages((prev) => [...prev, botMessage]);
    //  setIsTyping(false);
    //}, 2000); // Simule un délai de 2 secondes
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-4 overflow-y-auto mt-10">
        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-4 flex ${msg.user._id === 1 ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            {msg.user._id !== 1 && (
              <div className="w-12 h-12 rounded-full bg-gray-300 mr-3 flex-shrink-0">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlWp5AAOirHUvCB9jnepbzXhvIzR_1EZ690Q&s"
                  alt="Bot Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            )}
            <div
              className={`p-3 rounded-lg ${
                msg.user._id === 1
                  ? "bg-light_blue text-white font-poppins"
                  : "bg-gray-200 text-black font-poppins"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* Indicateur de chargement */}
        {isTyping && (
          <div className="mb-4 flex justify-start animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-gray-300 mr-3 flex-shrink-0">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlWp5AAOirHUvCB9jnepbzXhvIzR_1EZ690Q&s"
                alt="Bot Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="p-3 rounded-lg bg-gray-200 text-black font-poppins">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white flex items-center h-20">
        <input
          type="text"
          className={`flex-grow border rounded-lg px-4 py-2 font-poppins bg-white ${
            isTyping ? "cursor-not-allowed bg-gray-200 placeholder:text-center" : "placeholder:text-left"
          }`}
          placeholder={isTyping ? "Je réfléchis, veuillez patientez ..." : "Écrivez votre demande ..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isTyping) onSend();
          }}
          disabled={isTyping} // Désactive le champ si le bot répond
        />
        <button
          className={`bg-dark_blue text-white p-3 rounded-full flex items-center justify-center hover:bg-[#3b94c4] transition duration-300 ml-2 ${
            isTyping ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onSend}
          disabled={isTyping} // Désactive le bouton si le bot répond
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatWeb;