import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Code, Sparkles, ExternalLink } from "lucide-react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);

  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop for glow effects
  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      setTime(prev => prev + 0.01);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate dynamic positions for the background elements
  const bgPositionX = mousePosition.x * 20 - 10; // -10px to 10px
  const bgPositionY = mousePosition.y * 20 - 10; // -10px to 10px
  const glowSize = 140 + Math.sin(time) * 20; // Pulsing glow size

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "py-2 shadow-2xl" 
          : "py-4"
      }`}
      style={{
        background: isScrolled 
          ? 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(17,24,39,0.8), rgba(0,0,0,0.7))' 
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
        boxShadow: isScrolled ? '0 10px 30px -10px rgba(0,0,0,0.7)' : 'none'
      }}
    >
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div 
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl"
          style={{
            width: `${glowSize}px`,
            height: `${glowSize}px`,
            left: `calc(50% + ${bgPositionX * 3}px)`,
            top: `calc(50% + ${bgPositionY * 3}px)`,
            transform: 'translate(-50%, -50%)',
            opacity: isScrolled ? 0.7 : 0.3,
            transition: 'opacity 0.5s ease'
          }}
        />
      </div>

      <div className="container mx-auto px-4 flex items-center justify-between relative">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500"></div>
            <div className="relative">
              <Code className="h-6 w-6 text-white z-10 transition-all group-hover:scale-110 duration-300" />
            </div>
            <span 
              className="absolute -top-1 -right-1 z-20"
              style={{
                animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              <Sparkles className="h-3 w-3 text-yellow-300" />
            </span>
          </div>
          <span className="relative text-xl md:text-2xl font-bold tracking-wider">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400 bg-clip-text blur-sm opacity-75 animate-pulse"></span>
            <span className="relative bg-gradient-to-br from-white via-indigo-200 to-purple-100 bg-clip-text text-transparent">
              Python30
            </span>
          </span>
        </div>

        {/* Desktop view */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://github.com/TheRealSaitama"
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-purple-600/40 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            <span className="relative flex items-center gap-1 glass-button px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-1 z-10 group-hover:pl-6 group-hover:pr-5">
              <span className="font-medium">GitHub</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
            </span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative text-white hover:text-primary hover:scale-110 transition-all overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-300"></span>
            <Menu className="relative z-10" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/70 backdrop-blur-lg shadow-lg border-t border-white/5 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <a
              href="https://github.com/TheRealSaitama"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-primary transition-colors py-2 flex items-center justify-between"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></span>
                GitHub
              </span>
              <span className="text-xs bg-gradient-to-r from-indigo-400 to-purple-500 px-2 py-1 rounded-full">Visit</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
