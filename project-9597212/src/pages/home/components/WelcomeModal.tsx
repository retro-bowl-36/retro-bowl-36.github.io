import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<null | { email?: string }>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem("welcomeSeen");
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
        setIsOpen(false);
      } else if (!seen) {
        setIsOpen(true);
        setIsVisible(true);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsOpen(false);
      } else {
        setUser(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem("welcomeSeen", "true");
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 350);
  }, []);

  if (!isOpen || user) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ease-out ${
        isVisible ? "bg-black/50 opacity-100" : "bg-black/50 opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-[420px] rounded-xl border border-white/10 bg-[#111111] p-8 shadow-2xl text-center transition-all duration-300 ease-out ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <i className="ri-close-line text-lg" />
        </button>

        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-emerald-500 rounded-2xl">
          <i className="ri-gamepad-fill text-black text-3xl" />
        </div>

        <h2 className="mb-2 text-xl font-black text-white tracking-tight">
          Quiz 76
        </h2>
        <p className="mb-1 text-sm text-white/50">
          Quiz 76
        </p>
        <p className="mb-6 text-xs text-white/30">
          Quiz 76
        </p>

        <button
          onClick={handleClose}
          className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 whitespace-nowrap"
        >
          Browse Games
        </button>
      </div>
    </div>
  );
}