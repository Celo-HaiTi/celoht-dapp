import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="app-shell grid min-h-[calc(100dvh-64px)] place-items-center px-4 py-12 sm:px-6">
      <section className="not-found-surface w-full max-w-2xl p-7 text-center sm:p-12">
        <p className="font-mono text-xs font-semibold tracking-[0.2em] text-gold-300">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
          This page isn&rsquo;t on-chain either
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-parchment-100/65">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or it moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild><Link href="/dashboard">Back to dashboard</Link></Button>
          <Button asChild variant="secondary"><Link href="/help">Visit Help Center</Link></Button>
        </div>
      </section>
    </div>
  );
}
