import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">아이고!</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          여기로 오면 어떡함!
        </p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          다시 돌아가기
        </a>
      </div>
    </div>
  );
};

export default NotFound;
