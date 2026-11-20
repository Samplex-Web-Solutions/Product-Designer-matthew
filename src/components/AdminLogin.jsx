import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (onSuccess && data.session) {
      onSuccess(data.session);
    }
  };

  return (
    <div className="min-h-screen bg-[#120c16] text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md rounded-2xl bg-[#18101c] border border-white/15 p-8 space-y-5 shadow-2xl"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#e85d04]">
            Admin Access
          </p>
          <h1 className="text-2xl font-bold mt-1">Portfolio Sign In</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sign in to manage projects, images, and case-study files.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs text-zinc-400">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#e85d04]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs text-zinc-400">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#e85d04]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#e85d04] hover:bg-[#f46a0e] disabled:opacity-60 py-3 text-sm font-semibold text-white transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}