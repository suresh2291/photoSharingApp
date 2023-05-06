import React, { useEffect, useRef, useState } from "react";
import { Button, Offcanvas, Form, Spinner, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { chat } from "../../../functions/user";
import "./style.css";
import { Comment } from "react-loader-spinner";

export default function Chat({ user }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const newMessage = {
      text: input,
      picture:user?.picture,
      isUser: true,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    setLoading(true);
    const response = await chat(input, user?.token);
    const aiMessage = {
      text: response.output,
      picture:'../../../images/chatgpt-96.png',
      isUser: false,
    };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    setLoading(false);
  }

  return (
    <div className="chat_home">
      <div className="chat-image" onClick={() => setShowChat(true)}>
        
        <OverlayTrigger
          placement='left'
          overlay={
            <Tooltip id='tooltip-left'>
             Chat GPT
            </Tooltip>
          }
        >
            <img src={`../../../images/chatgpt-50.png`} alt="" /> 
        </OverlayTrigger>
      </div>

      <Offcanvas
        show={showChat}
        placement="end"
        onHide={() => setShowChat(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Chat</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="chat-container">
          <Alert variant='info'>
          The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
        </Alert>
            {messages.map((message, index) => (
              <div
                className={`message ${
                  message.isUser ? "user-message" : "ai-message"
                }`}
                key={index}
              >
                <img className="chat-picture" src={message.picture} alt="" />
                <p>{message.text}</p>
              </div>
            ))}
            {loading && (
              <div className="message ai-message">
                <Comment
                  visible={true}
                  height="50"
                  width="50"
                  ariaLabel="comment-loading"
                  wrapperStyle={{}}
                  wrapperClass="comment-wrapper"
                  color="#fff"
                  backgroundColor="#F4442E"
                />
              </div>
            )}
          </div>
           <div className="chat-form-container">
          <Form className="chat-form">
            <Form.Group controlId="chatInput"  className="d-flex align-items-center">
              <Form.Control
                type="text"
                placeholder="Enter message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown ={(event) => {
                    if (event.ctrlKey && event.key === "Enter"){
                      event.preventDefault(); // prevent form submission
                      handleSend();
                    }
                  }}
                className="text-input"
              />
              <Button variant="primary" onClick={handleSend}>
                Send
              </Button>
            </Form.Group>
          </Form>
        </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
