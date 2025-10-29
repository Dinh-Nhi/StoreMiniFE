import { useState } from "react";
import { Bot, X, Send } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "🤖 Xin chào! Tôi gợi ý bạn thử sản phẩm mới nhất trong danh mục áo thun nhé!",
        },
      ]);
    }, 800);
  };

  return (
    <div>
      {/* 🔘 Nút mở chat */}
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <div className="ai-glow">
            <Bot size={28} strokeWidth={2.5} />
          </div>
        </button>
      )}

      {/* 💬 Hộp chat */}
      {isOpen && (
        <div className="chat-box animate-slide-up">
          <div className="chat-header">
            <div className="chat-title">AI Tư vấn sản phẩm 🤖</div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-body">
            {messages.length === 0 ? (
              <div className="chat-empty">
                Xin chào 👋! Tôi có thể giúp bạn chọn sản phẩm phù hợp nhất!
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`chat-message ${m.sender}`}>
                  {m.text}
                </div>
              ))
            )}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="chat-send-btn">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
