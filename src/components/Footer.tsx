import React from "react";
import { Github, Twitter, Linkedin, Mail, Code, Heart } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-black/60 to-black/40 backdrop-blur-xl py-10 neo-morphism mt-auto border-t border-white/10 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-6 gap-2 group">
            <div className="relative">
              <Code className="h-6 w-6 text-primary cosmic-glow group-hover:scale-110 transition-all duration-300" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-ping opacity-75"></span>
            </div>
            <span className="text-xl font-bold surreal-text tracking-wider bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Python30
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl mb-8">
            <div className="flex flex-col items-center">
              <h3 className="text-white/90 font-semibold mb-3 relative">
                Connect
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></span>
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/TheRealSaitama"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110 hover:cosmic-glow"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/CodesPasta"
                  className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110 hover:cosmic-glow"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/therealsaitama"
                  className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110 hover:cosmic-glow"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:keshavjhagithub@gmail.com"
                  className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110 hover:cosmic-glow"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-white/90 font-semibold mb-3 relative">
                Resources
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></span>
              </h3>
              <a
                href="https://docs.python.org/3/tutorial/index.html"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-colors mb-2 hover:translate-x-1 inline-flex transition-transform"
              >
                Python Docs
              </a>
              <a
                href="https://roadmap.sh/python"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-colors hover:translate-x-1 inline-flex transition-transform"
              >
                Learning Path
              </a>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-white/90 font-semibold mb-3 relative">
                About
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></span>
              </h3>
              <p className="text-gray-400 text-center flex items-center gap-1">
                Built with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> by Keshav
              </p>
              <a
                href="https://github.com/TheRealSaitama"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:cosmic-glow transition-all group relative inline-flex items-center"
              >
                @TheRealSaitama
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm pt-6 border-t border-white/10 w-full">
            <p>
              &copy; {currentYear} Python30 by Keshav (TheRealSaitama). All
              rights reserved.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Master Python with daily tips. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
