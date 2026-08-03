"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Props = { children: ReactNode; fallbackTitle?: string };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // In production this should report to an error-tracking service.
    console.error("CeloHT UI error boundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center"
        >
          <h2 className="font-display text-xl font-semibold">
            {this.props.fallbackTitle ?? "Something went wrong loading this section"}
          </h2>
          <p className="text-ink-soft dark:text-parchment-100/70 mt-2 text-sm">
            Try reloading the page. If the problem continues, please open an issue on GitHub.
          </p>
          <Button className="mt-4" onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
