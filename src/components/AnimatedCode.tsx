
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCodeProps {
  code: string;
  className?: string;
}

export const AnimatedCode: React.FC<AnimatedCodeProps> = ({ code, className }) => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (!completed) {
      let i = 0;
      const typeWriter = () => {
        if (i < code.length) {
          setDisplayedCode(code.substring(0, i + 1));
          i++;
          timeout = setTimeout(typeWriter, 50);
        } else {
          setCompleted(true);
        }
      };
      
      timeout = setTimeout(typeWriter, 500);
    }
    
    return () => clearTimeout(timeout);
  }, [code, completed]);

  return (
    <div className={cn("font-mono text-sm md:text-base rounded-lg p-4 bg-gray-800 text-gray-100 overflow-x-auto", className)}>
      <pre>{displayedCode || " "}</pre>
      {!completed && <span className="inline-block h-5 w-2 bg-white/70 animate-pulse ml-1"></span>}
    </div>
  );
};
