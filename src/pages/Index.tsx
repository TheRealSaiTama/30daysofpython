import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedCode } from "@/components/AnimatedCode";
import { toast } from "sonner";
import { Mail, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import PyLogo from "@/components/PyLogo";
import Header from "@/components/Header";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample Python code for the hero section
  const sampleCode = `# Day 1: Hello World in Python
print("Hello, Python!")

# A simple function
def greet(name):
    return f"Welcome to 30 Days of Python, {name}!"

# Using list comprehensions
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print(squares)  # [1, 4, 9, 16, 25]`;

  useEffect(() => {
    // Add particle effect
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.classList.add("absolute", "rounded-full");

      // Randomize particle properties
      const size = Math.random() * 3 + 1;
      const isGreen = Math.random() > 0.6;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = isGreen
        ? "rgba(80, 250, 123, 0.7)"
        : "rgba(240, 240, 100, 0.7)";
      particle.style.boxShadow = `0 0 ${size * 2}px ${
        isGreen ? "rgba(80, 250, 123, 0.5)" : "rgba(240, 240, 100, 0.5)"
      }`;

      // Position randomly
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      // Set animation
      particle.style.animation = `float ${
        Math.random() * 15 + 10
      }s linear infinite`;
      particle.style.opacity = "0";

      document.getElementById("particle-container")?.appendChild(particle);

      // Animate the opacity
      setTimeout(() => {
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      }, 100);

      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 25000);
    };

    // Create initial particles
    const particleInterval = setInterval(() => {
      if (document.getElementById("particle-container")) {
        createParticle();
      }
    }, 1000);

    for (let i = 0; i < 15; i++) {
      setTimeout(createParticle, i * 300);
    }

    return () => clearInterval(particleInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to subscribe");
      }

      toast.success("You're in!", {
        description: "Check your email for your first Python tip!",
      });
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to subscribe";

      if (errorMessage.includes("already subscribed")) {
        toast.error("Already subscribed", {
          description: "This email is already registered for Python tips.",
        });
      } else {
        toast.error("Oops! Something went wrong", {
          description: "Please try again later.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Particle container */}
      <div
        id="particle-container"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      ></div>

      {/* Hero section */}
      <section className="flex-grow flex items-center justify-center py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <div className="w-52 h-52 mb-8 floating">
              <PyLogo />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-left python-3d-shadow">
                Master Python in{" "}
                <span className="python-gradient bg-clip-text text-transparent cosmic-glow">
                  30 Days
                </span>{" "}
                with Daily Tips
              </h1>
              <p className="text-xl text-gray-300 text-center lg:text-left">
                Enter your email below to receive one practical Python tip every
                day for 30 consecutive days. Completely free.
              </p>

              <form onSubmit={handleSubmit} className="pt-4 space-y-4">
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full h-16 pl-12 pr-4 rounded-xl python-input text-lg neo-morphism"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-6 text-lg python-gradient neo-glow font-semibold flex items-center justify-center gap-2 group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Start Learning Python Now"}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>

              <div className="text-sm text-gray-400 text-center mt-2">
                No credit card required. No spam, ever. Unsubscribe anytime.
              </div>
            </div>

            <div className="lg:mt-0 animate-slide-in">
              <div className="glass-card overflow-hidden neo-glow neo-morphism border border-white/10">
                <AnimatedCode code={sampleCode} className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
