import React, { useState, useEffect } from "react";

// Declare JotForm function to avoid TypeScript error
declare global {
  interface Window {
    jotformEmbedHandler: (selector: string, domain: string) => void;
  }
}

const ChatBot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (isChatOpen) {
      const script = document.createElement("script");
      script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.jotformEmbedHandler) {
          window.jotformEmbedHandler(
            "iframe[id='JotFormIFrame-019597e8514b7d919710fa8c736fcde20a9f']",
            "https://www.jotform.com"
          );
        }
      };
    }
  }, [isChatOpen]);

  return (
    <div className="fixed bottom-4 right-4">
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          Open Chatbot
        </button>
      )}

      {isChatOpen && (
        <div className="bg-white p-4 rounded-lg shadow-lg fixed bottom-4 right-4">
          <button
            onClick={() => setIsChatOpen(false)}
            className="bg-red-500 text-white px-2 py-1 rounded-full absolute top-2 right-2"
          >
            ✖
          </button>
          <iframe
            id="JotFormIFrame-019597e8514b7d919710fa8c736fcde20a9f"
            title="Sophie: Order Assistant"
            onLoad={() => window.parent.scrollTo(0, 0)}
            allow="geolocation; microphone; camera; fullscreen"
            src="https://agent.jotform.com/019597e8514b7d919710fa8c736fcde20a9f?embedMode=iframe&background=1&shadow=1"
            frameBorder="0"
            style={{
              minWidth: "300px",
              maxWidth: "400px",
              height: "500px",
              border: "none",
            }}
            scrolling="no"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
