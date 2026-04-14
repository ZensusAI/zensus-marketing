import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RedirectToApp = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);

    window.location.replace(`https://app.zensus.app${location.pathname}`);

    return () => {
      document.head.removeChild(meta);
    };
  }, [location.pathname]);

  return null;
};

export default RedirectToApp;
