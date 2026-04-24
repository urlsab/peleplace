import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import DynamicBackground from "@/components/DynamicBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <DynamicBackground variant="sea" />
      <div className="text-center bg-card/80 backdrop-blur-sm rounded-3xl p-10 shadow-card">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">העמוד לא נמצא</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          חזרה לעמוד הראשי
        </a>
      </div>
    </div>
  );
};

export default NotFound;
