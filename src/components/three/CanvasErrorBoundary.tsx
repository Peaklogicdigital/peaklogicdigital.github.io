"use client";

import { Component, type ReactNode } from "react";

export default class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="w-full h-full bg-white/[0.02]" />;
    }
    return this.props.children;
  }
}
