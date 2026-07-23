"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner, FaWheelchair } from "react-icons/fa";
import { useAuth } from "./auth-provider";
import { firebaseEnabled } from "@/firebase/config";

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const router = useRouter();
  const auth = useAuth();
  const register = mode === "register";
  const forgot = mode === "forgot";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setNotice("");
    if (register && password !== confirm) { setNotice("Passwords do not match."); return; }
    setBusy(true);
    try {
      if (forgot) {
        if (!firebaseEnabled) throw new Error("Firebase is not configured. Password reset is unavailable.");
        await auth.reset(email);
        setNotice("Password reset email sent. Check your inbox.");
        return;
      }
      if (firebaseEnabled) {
        if (register) await auth.signUp(name.trim(), email, password);
        else await auth.signIn(email, password);
      } else {
        auth.login({ name: register ? name.trim() : email.split("@")[0] || "Sahaya user", email });
      }
      router.replace("/");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  if (mode === "login") {
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-lg">
        <label className="block text-sm font-semibold">Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="input mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" autoComplete="email" /></label>
        <label className="mt-4 block text-sm font-semibold">Password<input required minLength={6} type="password" value={password} onChange={event => setPassword(event.target.value)} className="input mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" autoComplete="current-password" /></label>
        {notice && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}
        <button disabled={busy} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 font-bold text-white disabled:opacity-60">{busy && <FaSpinner className="animate-spin" />}Login</button>
        <div className="mt-5 flex justify-between text-sm"><Link href="/register" className="font-bold text-brand-700">Sign Up</Link><Link href="/forgot-password" className="font-bold text-brand-700">Forgot Password</Link></div>
      </form>
    </main>;
  }

  return <main className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-5">
    <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl ring-1 ring-slate-200 sm:p-9">
      <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-brand-700"><FaWheelchair />Sahaya</Link>
      <h1 className="mt-7 text-3xl font-bold">{forgot ? "Reset password" : "Create your account"}</h1>
      <p className="mt-2 text-slate-600">{forgot ? "Enter your email and we’ll send a reset link." : "Start your accessible journey today."}</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        {!forgot && <label className="block text-sm font-semibold">Full name<input required value={name} onChange={event => setName(event.target.value)} className="input mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" autoComplete="name" /></label>}
        <label className="block text-sm font-semibold">Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="input mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" autoComplete="email" /></label>
        {!forgot && <><label className="block text-sm font-semibold">Password<input required minLength={6} type="password" value={password} onChange={event => setPassword(event.target.value)} className="input mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" autoComplete="new-password" /></label><label className="block text-sm font-semibold">Confirm password<input required minLength={6} type="password" value={confirm} onChange={event => setConfirm(event.target.value)} className="input mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" autoComplete="new-password" /></label></>}
        {notice && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 font-bold text-white disabled:opacity-60">{busy && <FaSpinner className="animate-spin" />}{forgot ? "Send reset link" : "Create account"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600"><Link href="/login" className="font-bold text-brand-700">Back to Login</Link></p>
    </section>
  </main>;
}
