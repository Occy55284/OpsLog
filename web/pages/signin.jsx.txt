import React, { useState } from "react";

export default function SignInPin() {
  const [manager, setManager] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!manager || pin.length !== 6) {
      setError("Select your name and enter your 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/login-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerId: manager, pin }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Sign-in failed");

      // Success → go to landing
      window.location.href = "/landing";
    } catch (err) {
      setError(err.message || "Incorrect code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-sky-600 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">OpsLog Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-white/90">Select Manager</label>
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-sky-300 text-white"
            >
              <option value="">Choose...</option>
              <option value="retail-lon">Retail Manager (London)</option>
              <option value="headchef-lon">Head Chef (London)</option>
              <option value="hosp-lon">Hospitality Manager (London)</option>
              <option value="chef-ncl">Chef Manager (Newcastle)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white/90">Enter 6-digit PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-sky-300 text-white tracking-widest text-center text-xl"
            />
          </div>

          {error && <p className="text-rose-300 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 bg-white text-indigo-700 font-semibold py-2 rounded-lg hover:bg-sky-100 transition"
          >
            {loading ? "Checking..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
