"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
    <div><h1 className="text-3xl font-bold text-slate-900">Something went wrong</h1><p className="mt-3 text-slate-600">Please try again. If the issue continues, return to Sahaya later.</p><button onClick={reset} className="mt-6 rounded-xl bg-brand-700 px-5 py-3 font-bold text-white">Try again</button></div>
  </main></body></html>;
}
