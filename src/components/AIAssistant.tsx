"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, MessageCircle, Send, Bot, User, Loader2, Sparkles, ChevronDown, RotateCcw } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

// ── Starter questions ──────────────────────────────────────────────────────

const STARTER_QUESTIONS = [
  "What hackathons are currently active?",
  "How do I form a team?",
  "How do projects get judged?",
  "How do I get my certificate?",
];

// ── Simple markdown renderer ───────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="ai-inline-code">$1</code>')
    .replace(/^### (.*$)/gm, "<h3 class='ai-h3'>$1</h3>")
    .replace(/^## (.*$)/gm, "<h3 class='ai-h3'>$1</h3>")
    .replace(/^• (.*$)/gm, "<li>$1</li>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.*$)/gm, "<li>$2</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul class="ai-list">${match}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^(?!<[hup])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}

// ── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="ai-message ai-bot-message">
      <div className="ai-avatar ai-bot-avatar">
        <Bot size={14} />
      </div>
      <div className="ai-bubble ai-bot-bubble ai-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

// ── Message Component ──────────────────────────────────────────────────────

function ChatMessage({ msg }: { msg: Message }) {
  const isBot = msg.role === "assistant";
  return (
    <div className={`ai-message ${isBot ? "ai-bot-message" : "ai-user-message"}`}>
      {isBot && (
        <div className="ai-avatar ai-bot-avatar">
          <Bot size={14} />
        </div>
      )}
      <div
        className={`ai-bubble ${isBot ? "ai-bot-bubble" : "ai-user-bubble"} ${msg.isError ? "ai-error-bubble" : ""}`}
      >
        {isBot ? (
          <div
            className="ai-markdown"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
          />
        ) : (
          <p>{msg.content}</p>
        )}
        <span className="ai-timestamp">
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      {!isBot && (
        <div className="ai-avatar ai-user-avatar">
          <User size={14} />
        </div>
      )}
    </div>
  );
}

// ── Main AI Assistant Component ────────────────────────────────────────────

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm **HackBot**, your AI assistant for HackForge. I can help you find hackathons, form teams, submit projects, and more.\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim(), history }),
        });

        const data = await res.json();

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: res.ok
            ? data.answer
            : data.error?.message || "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
          isError: !res.ok,
        };

        setMessages((prev) => [...prev, botMsg]);

        if (isMinimized) {
          setHasUnread(true);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "Connection error. Please check your internet connection and try again.",
            timestamp: new Date(),
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, isMinimized]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "👋 Hi! I'm **HackBot**, your AI assistant for HackForge. I can help you find hackathons, form teams, submit projects, and more.\n\nWhat would you like to know?",
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setHasUnread(false);
  };

  return (
    <>
      {/* ── Styles ── */}
      <style>{`
        /* ── Chat FAB Button ── */
        .ai-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.45), 0 0 0 0 rgba(99, 102, 241, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: ai-pulse-ring 3s ease-in-out infinite;
        }
        .ai-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.6);
        }
        .ai-fab-icon {
          color: white;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ai-fab:hover .ai-fab-icon { transform: rotate(-10deg) scale(1.1); }

        /* Unread badge */
        .ai-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          font-weight: 700;
          animation: ai-bounce 1s ease-in-out infinite;
        }

        @keyframes ai-pulse-ring {
          0%, 100% { box-shadow: 0 8px 32px rgba(99,102,241,0.45), 0 0 0 0 rgba(99,102,241,0.3); }
          50% { box-shadow: 0 8px 32px rgba(99,102,241,0.45), 0 0 0 10px rgba(99,102,241,0); }
        }
        @keyframes ai-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        /* ── Chat Panel ── */
        .ai-panel {
          position: fixed;
          bottom: 100px;
          right: 28px;
          z-index: 9998;
          width: 380px;
          max-width: calc(100vw - 40px);
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform-origin: bottom right;
          animation: ai-panel-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes ai-panel-in {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ai-panel.ai-minimized {
          height: 64px;
          animation: none;
        }

        /* ── Header ── */
        .ai-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 18px;
          background: linear-gradient(90deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1));
          border-bottom: 1px solid rgba(99,102,241,0.15);
          cursor: pointer;
          user-select: none;
        }
        .ai-header-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ai-header-text { flex: 1; min-width: 0; }
        .ai-header-name {
          font-size: 14px;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: 0.01em;
        }
        .ai-header-status {
          font-size: 11px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 2px;
        }
        .ai-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
          animation: ai-blink 2s ease-in-out infinite;
        }
        @keyframes ai-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .ai-header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ai-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .ai-icon-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }

        /* ── Messages area ── */
        .ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 380px;
          scrollbar-width: thin;
          scrollbar-color: rgba(99,102,241,0.3) transparent;
        }
        .ai-messages::-webkit-scrollbar { width: 4px; }
        .ai-messages::-webkit-scrollbar-track { background: transparent; }
        .ai-messages::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }

        /* ── Message layout ── */
        .ai-message {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          animation: ai-msg-in 0.25s ease-out;
        }
        @keyframes ai-msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ai-user-message { flex-direction: row-reverse; }
        .ai-avatar {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ai-bot-avatar {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
        }
        .ai-user-avatar {
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
        }

        /* ── Bubbles ── */
        .ai-bubble {
          max-width: 78%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.55;
          position: relative;
        }
        .ai-bot-bubble {
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(99,102,241,0.18);
          color: #cbd5e1;
          border-bottom-left-radius: 4px;
        }
        .ai-user-bubble {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .ai-error-bubble {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #fca5a5;
        }
        .ai-timestamp {
          display: block;
          font-size: 10px;
          margin-top: 5px;
          opacity: 0.45;
        }

        /* ── Markdown ── */
        .ai-markdown p { margin: 0 0 6px 0; }
        .ai-markdown p:last-child { margin-bottom: 0; }
        .ai-markdown strong { color: #e2e8f0; font-weight: 600; }
        .ai-markdown em { font-style: italic; color: #c4b5fd; }
        .ai-list { margin: 6px 0; padding-left: 16px; list-style: disc; }
        .ai-list li { margin-bottom: 3px; }
        .ai-h3 { font-size: 13px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px; }
        .ai-inline-code {
          background: rgba(99,102,241,0.15);
          color: #a5b4fc;
          padding: 1px 5px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }

        /* ── Typing indicator ── */
        .ai-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
        }
        .ai-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          animation: ai-typing-dot 1.2s ease-in-out infinite;
        }
        .ai-typing span:nth-child(2) { animation-delay: 0.2s; }
        .ai-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ai-typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* ── Starter suggestions ── */
        .ai-starters {
          padding: 0 16px 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .ai-starter-btn {
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          color: #a5b4fc;
          font-size: 11.5px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .ai-starter-btn:hover {
          background: rgba(99,102,241,0.25);
          border-color: rgba(99,102,241,0.5);
          color: #e0e7ff;
        }

        /* ── Input area ── */
        .ai-input-area {
          padding: 12px 16px 16px;
          border-top: 1px solid rgba(99,102,241,0.1);
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }
        .ai-textarea-wrap {
          flex: 1;
          position: relative;
        }
        .ai-textarea {
          width: 100%;
          min-height: 40px;
          max-height: 100px;
          background: rgba(30,41,59,0.8);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 12px;
          color: #e2e8f0;
          font-size: 13.5px;
          padding: 10px 14px;
          resize: none;
          outline: none;
          font-family: inherit;
          line-height: 1.5;
          transition: border-color 0.15s;
          scrollbar-width: thin;
          box-sizing: border-box;
        }
        .ai-textarea:focus { border-color: rgba(99,102,241,0.5); }
        .ai-textarea::placeholder { color: #475569; }

        .ai-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .ai-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ai-send-btn:not(:disabled):hover { opacity: 0.9; transform: scale(1.05); }

        /* ── Powered by footer ── */
        .ai-footer {
          padding: 8px 16px;
          text-align: center;
          font-size: 10.5px;
          color: #475569;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .ai-footer span { color: #6366f1; }
      `}</style>

      {/* ── FAB Button ── */}
      {!isOpen && (
        <button
          id="ai-assistant-fab"
          className="ai-fab"
          onClick={handleOpen}
          aria-label="Open AI Assistant"
          title="Chat with HackBot"
        >
          <MessageCircle size={26} className="ai-fab-icon" />
          {hasUnread && <div className="ai-badge">1</div>}
        </button>
      )}

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div className={`ai-panel ${isMinimized ? "ai-minimized" : ""}`} role="dialog" aria-label="HackBot AI Assistant">

          {/* Header */}
          <div className="ai-header" onClick={() => setIsMinimized((v) => !v)}>
            <div className="ai-header-icon">
              <Sparkles size={16} color="white" />
            </div>
            <div className="ai-header-text">
              <div className="ai-header-name">HackBot</div>
              {!isMinimized && (
                <div className="ai-header-status">
                  <span className="ai-status-dot" />
                  Powered by Gemini · RAG enabled
                </div>
              )}
            </div>
            <div className="ai-header-actions" onClick={(e) => e.stopPropagation()}>
              <button className="ai-icon-btn" onClick={resetChat} title="Reset conversation">
                <RotateCcw size={14} />
              </button>
              <button className="ai-icon-btn" onClick={() => setIsMinimized((v) => !v)} title={isMinimized ? "Expand" : "Minimize"}>
                <ChevronDown size={16} style={{ transform: isMinimized ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              <button className="ai-icon-btn" onClick={() => setIsOpen(false)} title="Close">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="ai-messages" role="log" aria-live="polite">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} msg={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Starter questions (only shown at start) */}
              {messages.length <= 1 && (
                <div className="ai-starters">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      className="ai-starter-btn"
                      onClick={() => sendMessage(q)}
                      disabled={isLoading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="ai-input-area">
                <div className="ai-textarea-wrap">
                  <textarea
                    ref={inputRef}
                    id="ai-chat-input"
                    className="ai-textarea"
                    placeholder="Ask HackBot anything…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    maxLength={1000}
                    disabled={isLoading}
                    aria-label="Chat input"
                  />
                </div>
                <button
                  id="ai-send-btn"
                  className="ai-send-btn"
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>

              {/* Powered by footer */}
              <div className="ai-footer">
                Powered by <span>Google Gemini</span> · LangChain RAG
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
