import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Mail } from "lucide-react";

interface NewsletterFormProps {
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ className }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (!isFocused) {
      interval = setInterval(() => {
        setGlowIntensity(prev => {
          const newValue = prev + (Math.sin(Date.now() / 1000) * 0.1);
          return Math.max(0.5, Math.min(0.8, newValue));
        });
      }, 50);
    } else {
      setGlowIntensity(1.2);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocused]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(`Attempting to subscribe with email: ${email}`);

      // Create a text response handler in case JSON parsing fails
      const handleTextResponse = async (response: Response) => {
        const text = await response.text();
        console.log("Raw response:", text);
        
        // Try to parse as JSON if it looks like JSON
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error("Failed to parse JSON-like response:", e);
            return { success: false, message: "Invalid response from server" };
          }
        }
        
        // Not JSON, return a simple object
        return { 
          success: false, 
          message: "Server returned non-JSON response",
          status: response.status,
          statusText: response.statusText,
          responsePreview: text.slice(0, 100) + (text.length > 100 ? '...' : '')
        };
      };

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log(`Response status: ${response.status} ${response.statusText}`);
      console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));

      const data = await handleTextResponse(response);
      
      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      console.log("Subscription successful:", data);
      toast.success("Thank you for subscribing!", {
        description: data.message || "Check your email for the welcome message.",
      });

      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to subscribe";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-grow">
          <Mail 
            className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-all duration-300 text-indigo-400`}
            style={{
              filter: `drop-shadow(0 0 ${glowIntensity * 12}px rgba(99, 102, 241, ${0.8 + glowIntensity * 0.2}))`,
              transition: 'filter 0.3s ease-in-out, color 0.3s ease-in-out'
            }}
          />
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="pl-10 transition-all focus:ring-2 focus:ring-primary/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25">
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterForm;
