import React from 'react';

const ChatSidebox = ({ activeChatCase, isChatOpen, handleChatClose }) => {
  if (!isChatOpen) return null; // If chat is closed, do not render the component

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        bottom: 0,
        width: '350px',
        height: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header of the chatbox */}
      <div
        style={{
          backgroundColor: '#1976d2',
          color: '#ffffff',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4 style={{ margin: 0, fontSize: '16px' }}>Chat - Case ID: {activeChatCase}</h4>
        <button
          onClick={handleChatClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>

      {/* Chat messages container */}
      <div
        style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div
          style={{
            backgroundColor: '#f1f1f1',
            padding: '8px',
            borderRadius: '8px',
            maxWidth: '80%',
            alignSelf: 'flex-start',
          }}
        >
          <p style={{ margin: 0 }}>Hello, how can I help you with your case?</p>
        </div>
        <div
          style={{
            backgroundColor: '#1976d2',
            color: '#ffffff',
            padding: '8px',
            borderRadius: '8px',
            maxWidth: '80%',
            alignSelf: 'flex-end',
          }}
        >
          <p style={{ margin: 0 }}>I need to discuss the details of my case.</p>
        </div>
      </div>

      {/* Input box for new message */}
      <div
        style={{
          display: 'flex',
          padding: '10px',
          backgroundColor: '#f1f1f1',
          borderTop: '1px solid #ddd',
        }}
      >
        <input
          type="text"
          placeholder="Type a message"
          style={{
            width: '80%',
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            marginRight: '10px',
            fontSize: '14px',
          }}
        />
        <button
          style={{
            backgroundColor: '#1976d2',
            color: '#ffffff',
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSidebox;
