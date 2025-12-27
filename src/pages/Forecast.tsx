import { useEffect } from "react";

const Forecast = () => {
  useEffect(() => {
    window.location.href = "https://app.zensus.app/forecast";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-foreground">
        Redirecting to{" "}
        <a 
          href="https://app.zensus.app/forecast" 
          className="text-primary underline"
        >
          app.zensus.app/forecast
        </a>
        ...
      </p>
    </div>
  );
};

export default Forecast;
