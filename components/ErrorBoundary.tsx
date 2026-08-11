"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  toolSlug?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg p-6 text-center">
          <p className="text-[var(--color-error-text)] font-medium mb-2">工具加载失败</p>
          <p className="text-[var(--color-error-text)] text-sm mb-4 opacity-80">
            {this.state.error?.message || "未知错误"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm hover:bg-[var(--color-accent-hover)]"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
