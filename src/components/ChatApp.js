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
  const isFirstLoad = useRef(true);

  useEffect(() => {
    console.log("Receiver ID:", receiverId); // Debug: Ensure receiverId is passed

    const loadHistory = async () => {
      try {
        const {
          messages: history = [],
          lastEvaluatedKey: newKey = null,
        } = await fetchMessageHistory(connectionId, receiverId, lastEvaluatedKey);

        console.log("Fetched History:", history); // Debug: Log fetched history
        console.log("Last Evaluated Key:", newKey);

        const parsedHistory = history.map((msg) => ({
          ...msg,
          isSent: msg.senderId === connectionId,
        }));

        setMessages((prevMessages) => [...parsedHistory, ...prevMessages]);
        setLastEvaluatedKey(newKey);
        setUnreadCount(0);

        if (isFirstLoad.current) {
          scrollToBottom();
          isFirstLoad.current = false;
        }
      } catch (error) {
        console.error("Error loading message history:", error);
      }
    };

    loadHistory();

    // Initialize WebSocket connection
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

    // Clean up WebSocket connection on unmount
    return () => websocketService.close();
  }, [connectionId, receiverId]);

  const loadMoreMessages = async () => {
    if (!lastEvaluatedKey) return;

    try {
      const {
        messages: history = [],
        lastEvaluatedKey: newKey = null,
      } = await fetchMessageHistory(connectionId, receiverId, lastEvaluatedKey);

      console.log("Loading more messages:", history); // Debug: Log paginated messages

      const parsedHistory = history.map((msg) => ({
        ...msg,
        isSent: msg.senderId === connectionId,
      }));

      setMessages((prevMessages) => [...parsedHistory, ...prevMessages]);
      setLastEvaluatedKey(newKey);
    } catch (error) {
      console.error("Error loading more messages:", error);
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0 && !isFirstLoad.current) {
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
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        Back to Conversations
      </button>
      <h2 style={styles.header}>
        Chat with {receiverId || "Unknown Receiver"}
        {unreadCount > 0 && (
          <span style={styles.unreadCount}>({unreadCount})</span>
        )}
      </h2>
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={styles.chatContainer}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent: msg.isSent ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: msg.isSent ? "#daf8e3" : "#f1f0f0",
              }}
            >
              <div>{msg.content}</div>
              <div style={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString()}{" "}
                {msg.isSent && !msg.read && <span style={styles.singleCheck}>✔</span>}
                {msg.read && msg.isSent && <span style={styles.doubleCheck}>✔✔</span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputWrapper}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.inputField}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "'Arial', sans-serif",
  },
  backButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
  },
  header: {
    textAlign: "center",
    color: "#333",
  },
  unreadCount: {
    fontSize: "small",
    color: "red",
  },
  chatContainer: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    height: "400px",
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
  },
  messageWrapper: {
    display: "flex",
    margin: "10px 0",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  timestamp: {
    fontSize: "0.8em",
    color: "#555",
    textAlign: "right",
    marginTop: "5px",
  },
  singleCheck: {
    color: "gray",
  },
  doubleCheck: {
    color: "blue",
  },
  inputWrapper: {
    display: "flex",
    marginTop: "10px",
  },
  inputField: {
    flex: "1",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px 0 0 5px",
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "0 5px 5px 0",
    padding: "10px 15px",
    cursor: "pointer",
  },
};

export default ChatApp;
