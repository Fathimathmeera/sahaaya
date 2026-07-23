"use client";
import Link from "next/link";
import { FaArrowRight, FaCamera, FaExclamationTriangle, FaHeart, FaMapMarkedAlt, FaRegHospital, FaSignOutAlt, FaUsers, FaWheelchair } from "react-icons/fa";
import { useAuth } from "@/components/auth-provider";

const features = [
  { title: "Accessible Navigation", description: "Plan step-free routes with preferences for ramps and elevators.", href: "/navigation", icon: FaMapMarkedAlt, tone: "bg-sky-100 text-sky-800" },
  { title: "Indoor Navigation", description: "Find elevators, ramps, washrooms, exits, and accessible rooms.", href: "/indoor", icon: FaWheelchair, tone: "bg-emerald-100 text-emerald-800" },
  { title: "Building Accessibility Scanner", description: "Review visible access features from a building image.", href: "/scanner", icon: FaCamera, tone: "bg-violet-100 text-violet-800" },
  { title: "Community Reports", description: "Share and explore local accessibility updates.", href: "/community", icon: FaUsers, tone: "bg-amber-100 text-amber-800" },
  { title: "Emergency SOS", description: "Share your location with contacts and find nearby hospitals.", href: "/emergency", icon: FaExclamationTriangle, tone: "bg-rose-100 text-rose-800" },
  { title: "Health Reminders", description: "Keep important wellbeing routines close at hand.", href: "/health", icon: FaRegHospital, tone: "bg-teal-100 text-teal-800" },
];

export default function Home() {
  const { user, loading, logout } = useAuth();
  if (loading) return <main className="grid min-h-screen place-items-center bg-slate-50"><span className="h-9 w-9 animate-spin rounded-full border-4 border-brand-700 border-t-transparent" /></main>;

  if (!user) return <main className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-6 text-center">
    <section className="max-w-2xl"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-700 text-3xl text-white"><FaWheelchair /></div><h1 className="mt-6 text-5xl font-extrabold tracking-tight">Welcome to Sahaya</h1><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">Your accessibility companion for safer, more confident journeys.</p><div className="mt-8 flex justify-center gap-3"><Link href="/login" className="rounded-xl bg-brand-700 px-6 py-3 font-bold text-white">Login</Link><Link href="/register" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-brand-700">Register</Link></div></section>
  </main>;

  return <main className="min-h-screen bg-slate-50 text-slate-900"><nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-brand-700"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-white"><FaWheelchair /></span>Sahaya</Link><div className="flex items-center gap-4"><span className="hidden text-sm text-slate-600 sm:block">Welcome, {user.name}</span><button onClick={() => logout()} className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700"><FaSignOutAlt />Logout</button></div></nav><section className="border-y border-slate-200 bg-gradient-to-r from-brand-50 to-emerald-50"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><p className="font-bold text-emerald-700">YOUR SAHAYA HOME</p><h1 className="mt-2 text-4xl font-extrabold tracking-tight">Choose how Sahaya can help today.</h1><p className="mt-3 max-w-2xl text-slate-600">Explore accessibility tools built for more independent daily movement.</p></div></section><section className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{features.map(feature => { const Icon = feature.icon; return <Link key={feature.title} href={feature.href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"><span className={"grid h-12 w-12 place-items-center rounded-xl text-xl " + feature.tone}><Icon /></span><h2 className="mt-5 text-lg font-extrabold">{feature.title}</h2><p className="mt-2 leading-6 text-slate-600">{feature.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">Open tool <FaArrowRight className="transition group-hover:translate-x-1" /></span></Link> })}</div></section></main>;
}
