import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Trash2, Loader2 } from "lucide-react";

const SAMPLE_QUESTIONS = [
  "How do you ensure confidentiality and privacy during therapy?",
  "What are your qualifications and experience as a therapy assistant?",
  "How long will therapy take and how often will I need to attend sessions?",
  "What is the cost of therapy and do you accept insurance?"
];

const App = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const message = input.trim();
    if (!message) {
      setError("Please enter a question");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: message
        }),
        headers: {
          "Content-Type": "application/json"
        }
      };

      const response = await fetch("http://localhost:8080/gemini/", options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      
      setChatHistory(prev => [...prev,
        {
          role: "user",
          parts: [{ text: message }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        }
      ]);
      
      setInput("");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to get response. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setError("");
    setChatHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card className="p-4">
        <CardContent className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">Sample Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SAMPLE_QUESTIONS.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto whitespace-normal"
                onClick={() => setInput(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="chat-container h-[500px] overflow-y-auto border rounded-lg p-4">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`mb-4 ${
              chat.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block max-w-[70%] rounded-lg p-3 ${
                chat.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {chat.parts[0].text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyPress}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isLoading || (!input && !chatHistory.length)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default App;