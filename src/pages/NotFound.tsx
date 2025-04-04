
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="glass-card p-12 max-w-md w-full text-center">
        <h1 className="text-5xl font-bold mb-6 python-gradient bg-clip-text text-transparent">404</h1>
        <p className="text-2xl font-semibold mb-3">Page Not Found</p>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for.
        </p>
        <Button className="python-gradient text-white" asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
