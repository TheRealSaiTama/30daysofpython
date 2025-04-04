import React, { useEffect, useRef } from 'react';

const PyLogo: React.FC = () => {
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      const blueEl = logoRef.current.querySelector('.blue-part');
      const yellowEl = logoRef.current.querySelector('.yellow-part');
      
      if (blueEl && yellowEl) {
        const animateElement = (el: Element, delay: number) => {
          const keyframes = [
            { transform: 'translateY(0) scale(1)', filter: 'brightness(1)' },
            { transform: 'translateY(-3px) scale(1.02)', filter: 'brightness(1.1)' },
            { transform: 'translateY(0) scale(1)', filter: 'brightness(1)' }
          ];
          
          el.animate(keyframes, {
            duration: 5000,
            delay,
            iterations: Infinity,
            easing: 'ease-in-out'
          });
        };
        
        animateElement(blueEl, 0);
        animateElement(yellowEl, 2500);
      }
    }
  }, []);

  return (
    <div className="python-3d-logo relative w-full h-full overflow-visible">
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20 scale-150">
        <svg 
          viewBox="0 0 256 255" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path 
            d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.777c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" 
            fill="#50FA7B" 
          />
          <path 
            d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" 
            fill="#F0F064" 
          />
        </svg>
      </div>
      
      <svg 
        ref={logoRef}
        viewBox="0 0 256 255" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMinYMin meet"
        className="w-full h-full relative z-10"
      >
        <defs>
          <linearGradient x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%" id="a">
            <stop stopColor="#50FA7B" offset="0%" />
            <stop stopColor="#3A7563" offset="100%" />
          </linearGradient>
          <linearGradient x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%" id="b">
            <stop stopColor="#F0F064" offset="0%" />
            <stop stopColor="#D6C620" offset="100%" />
          </linearGradient>
          
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="inner-shadow">
            <feOffset dx="2" dy="2" />
            <feGaussianBlur stdDeviation="2" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.4" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>
        
        <path 
          className="blue-part"
          d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.777c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" 
          fill="url(#a)"
          filter="url(#glow-blue)"
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(80, 250, 123, 0.7))',
          }}
        />
        
        <path 
          className="yellow-part"
          d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" 
          fill="url(#b)"
          filter="url(#glow-yellow)"
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(240, 240, 100, 0.7))',
          }}
        />
      </svg>
      
      <div className="absolute inset-0 -z-5 scale-95 blur-md opacity-40 translate-x-6 translate-y-6">
        <svg 
          viewBox="0 0 256 255" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="xMinYMin meet"
          className="w-full h-full"
        >
          <path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.777c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="#1a2a20"/>
          <path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="#2a3a20"/>
        </svg>
      </div>
      
      <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-white animate-pulse" 
           style={{ boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)', animationDuration: '3s' }}></div>
      <div className="absolute top-2/3 right-1/3 h-1.5 w-1.5 rounded-full bg-white animate-pulse"
           style={{ boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)', animationDuration: '2.5s', animationDelay: '1s' }}></div>
    </div>
  );
};

export default PyLogo;
