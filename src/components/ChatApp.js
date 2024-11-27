import React, { useState, useEffect, useRef } from "react";
import websocketService from "./websocketService";
import { fetchMessageHistory } from "./messageService";

const ChatApp = ({ connectionId, receiverId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const hasFetchedHistory = useRef(false);

  useEffect(() => {
    const initializeChat = async () => {
      if (!hasFetchedHistory.current) {
        hasFetchedHistory.current = true;
        const { messages: history, lastEvaluatedKey: newKey } = await fetchMessageHistory(
          connectionId,
          receiverId,
          null
        );

        const parsedHistory = history.map((msg) => ({
          ...msg,
          isSent: msg.senderId === connectionId,
        }));

        setMessages(parsedHistory);
        setLastEvaluatedKey(newKey);
        setUnreadCount(0);
        scrollToBottom();
      }

      if (!websocketService.ws || websocketService.ws.readyState !== WebSocket.OPEN) {
        websocketService.connect(connectionId, (message) => {
          const updatedMessage = {
            ...message,
            isSent: message.senderId === connectionId,
          };
          setMessages((prevMessages) => [...prevMessages, updatedMessage]);
          if (!updatedMessage.isSent) {
            setUnreadCount((prevCount) => prevCount + 1);
          }
          scrollToBottom();
        });
      }
    };

    initializeChat();

    return () => websocketService.close();
  }, [connectionId, receiverId]);

  const loadMoreMessages = async () => {
    if (!lastEvaluatedKey) return;

    const { messages: history, lastEvaluatedKey: newKey } = await fetchMessageHistory(
      connectionId,
      receiverId,
      lastEvaluatedKey
    );

    const parsedHistory = history.map((msg) => ({
      ...msg,
      isSent: msg.senderId === connectionId,
    }));

    setMessages((prevMessages) => [...parsedHistory, ...prevMessages]);
    setLastEvaluatedKey(newKey);
  };

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0) {
      loadMoreMessages();
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const messageData = {
        action: "sendMessage",
        senderId: connectionId,
        receiverId: receiverId,
        content: inputMessage,
        timestamp: new Date().toISOString(),
        read: false,
      };

      websocketService.sendMessage(messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, isSent: true, read: false },
      ]);
      setInputMessage("");
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Chat Header */}
      <div style={{
        padding: "15px",
        backgroundColor: "#0088cc",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "18px",
        fontWeight: "bold"
      }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: "#005f99",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "8px 15px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Back
        </button>
        <span>Police Chat</span>
        {unreadCount > 0 && (
          <span style={{
            fontSize: "14px",
            color: "yellow",
            marginLeft: "10px",
            fontWeight: "bold"
          }}>
            ({unreadCount} New)
          </span>
        )}
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          borderBottom: "1px solid #ccc",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: "10px 0" }}>
            {msg.type === "date" ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#888",
                  fontSize: "12px",
                  padding: "5px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "15px",
                  width: "auto",
                  margin: "0 auto",
                  maxWidth: "200px"
                }}
              >
                {msg.content}
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: msg.isSent ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "12px",
                    borderRadius: "20px",
                    backgroundColor: msg.isSent ? "#dcf8c6" : "#fff",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                    color: "#333"
                  }}
                >
                  {msg.content}
                  <div style={{ fontSize: "0.8em", color: "#555", textAlign: "right", marginTop: "5px" }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                    {msg.isSent && !msg.read && <span style={{ color: "gray", marginLeft: "5px" }}>✔</span>}
                    {msg.read && msg.isSent && <span style={{ color: "blue", marginLeft: "5px" }}>✔✔</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div style={{
        padding: "10px",
        backgroundColor: "#f7f7f7",
        borderTop: "1px solid #ccc",
        display: "flex",
        alignItems: "center"
      }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "14px"
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: "#0088cc",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            marginLeft: "10px"
          }}
        >
          📤
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
