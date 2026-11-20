import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import PortfolioPage from "./pages/PortfolioPage";
import AdminLogin from "./components/AdminLogin";
import AdminProjects from "./components/AdminProjects";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      window.removeEventListener("popstate", onPopState);
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (path.startsWith("/admin")) {
    if (checkingSession) {
      return (
        <div className="min-h-screen bg-[#120c16] text-zinc-400 flex items-center justify-center text-sm">
          Checking session...
        </div>
      );
    }

    if (!session) {
      return <AdminLogin onSuccess={(newSession) => setSession(newSession)} />;
    }

    return <AdminProjects session={session} />;
  }

  return <PortfolioPage />;
}