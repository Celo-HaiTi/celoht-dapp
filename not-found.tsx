import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-gold-800 dark:text-gold-300 font-mono text-xs tracking-[0.2em] uppercase">
        404
      </p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">
        This page isn&rsquo;t on-chain either
      </h1>
      <p className="text-ink-soft dark:text-parchment-100/70 mt-4 max-w-md">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or it moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/help">Visit Help Center</Link>
        </Button>
      </div>
    </div>
  );
}
