import { useState } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // 👉 tạm thời fix user_id để test, sau có thể truyền từ frontend login
          message: currentInput,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || "🤖 Xin lỗi, có lỗi khi xử lý yêu cầu của bạn.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Xin lỗi, hệ thống AI hiện đang bận. Vui lòng thử lại sau nhé!",
        },
      ]);
    } finally {
      setLoading(false);
    }
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
            <div className="chat-title">💚 ShopMini AI tư vấn sản phẩm</div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-body">
            {messages.length === 0 ? (
              <div className="chat-empty">
                Xin chào 👋! Tôi là <b>ShopMini</b> – trợ lý mua sắm của bạn.
                Hãy nhập thử: <i>“Tôi muốn mua áo thun”</i> nhé!
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`chat-message ${m.sender}`}>
                  {m.sender === "ai" ? (
                    <ReactMarkdown
                      children={m.text}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          />
                        ),
                      }}
                    />
                  ) : (
                    m.text
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="chat-message ai loading flex items-center gap-2">
                <div className="typing-indicator flex gap-1">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <span className="text-gray-600 italic">
                  ShopMini đang tìm sản phẩm phù hợp...
                </span>
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="chat-send-btn"
              disabled={loading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
