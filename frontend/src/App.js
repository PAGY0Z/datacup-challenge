// App.js
import React from "react";
import WidgetChatbox from "./components/widget_chatbox";
import ChatWeb from "./ChatWeb";

function App() {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      {/* Pass ChatWeb as a Prop to Widget */}
      <WidgetChatbox ChatComponent={ChatWeb} />
    </div>
  );
}

export default App;
