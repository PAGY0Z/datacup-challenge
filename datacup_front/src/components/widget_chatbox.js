import React, { useState, useEffect } from "react";

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

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-2 sm:right-2">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
      >
        {isOpen ? "Close Chat" : "Open Chat"}
      </button>

      {/* Widget */}
      {isOpen && (
        <div
          className={`${isMobile || isFullscreen
              ? "inset-0 w-full h-full"
              : "w-80 h-[70vh] sm:w-[90vw] sm:h-[60vh]"
            } bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col`}
        >
          {/* Header */}
          <div className="bg-gray-200 p-4 flex justify-between items-center">
            <h4 className="text-lg font-bold">Chat Widget</h4>
            <div className="flex gap-2">
              {!isMobile && (
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {isFullscreen ? "Windowed" : "Fullscreen"}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
          </div>

          {/* Chat Component */}
          <div className="flex-grow overflow-hidden">
            <ChatComponent />
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetChatbox;
