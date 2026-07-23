import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-brand-700">404</p>
      <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-600">This Sahaya page is unavailable or may have moved.</p>
      <Link href="/navigation" className="mt-6 inline-block rounded-xl bg-brand-700 px-5 py-3 font-bold text-white">Go to navigation</Link>
    </div>
  </main>;
}
