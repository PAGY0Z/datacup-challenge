import React, { useState, useEffect } from "react";

const image_background_mobile = "https://static.wixstatic.com/media/4dcb77_19ef1b3845584c3d862a47f28d5cc6a6~mv2.png";
const image_background_pc = "https://static.wixstatic.com/media/4dcb77_69e59d37a44147a6aee2beb3405ed87a~mv2.png";

const WidgetChatbox = ({ ChatComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the user is on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Consider <= 768px as mobile
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatically set fullscreen on mobile
  useEffect(() => {
    if (isMobile) {
      setIsFullscreen(true);
    }
  }, [isMobile]);

  return (
    <div
      className="h-screen w-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${isMobile ? image_background_mobile : image_background_pc})`,
      }}
    >
      <div className="fixed bottom-5 right-5 sm:bottom-2 sm:right-2"></div>
      <div className="fixed bottom-5 right-5 sm:bottom-2 sm:right-2">
        {/* Toggle Button */}
        {!isOpen && (
          <div className="flex flex-col items-center mb-5 mr-5">
            {/* Bulle de texte */}
            <div className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg shadow-md mb-2 text-center">
              <span>Une question</span>
              <br />
              <span>sur le Kap Numérik ?</span>
            </div>
            {/* Bouton Open */}
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-500 rounded-full w-24 h-24 flex items-center justify-center shadow-lg hover:bg-blue-700 transition duration-300"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                <img
                  src="https://static.wixstatic.com/media/4dcb77_41fcd8b7c96248d6862c42502e4c2007~mv2.png"
                  alt="Chat Icon"
                  className="w-18 h-18 object-contain"
                />
              </div>
            </button>
          </div>
        )}

        {/* Widget */}
        <div
          className={`${
            isFullscreen
              ? "fixed inset-0 w-full h-full z-50" // Fullscreen mode
              : "w-[500px] h-[80vh] fixed bottom-5 right-5 shadow-xl" // Smaller dimensions for windowed mode
          } bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {/* Header */}
          <div className="bg-gray-200 p-4 flex justify-between items-center">
            <h4 className="text-lg font-bold">Assistant Kap Numérik</h4>
            <div className="flex gap-2">
              {/* Show fullscreen toggle only on PC */}
              {!isMobile && (
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700"
                >
                  {isFullscreen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 8h16M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4h6M4 4v6M20 20h-6m6 0v-6M4 20h6m-6 0v-6m16-10v6m0-6h-6"
                      />
                    </svg>
                  )}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Component */}
          <div className="flex-grow overflow-hidden">
            <ChatComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetChatbox;