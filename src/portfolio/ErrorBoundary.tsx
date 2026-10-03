import { Component, type ReactNode } from 'react';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="not-found section-shell"><p className="eyebrow">A moment out of frame</p><h1>Let’s take<br /><em>another look.</em></h1><p>The portfolio couldn’t load correctly. Please refresh, or email hailuong.vfx@gmail.com.</p><button className="button button-light" onClick={() => window.location.reload()}>Reload portfolio</button></main>;
    return this.props.children;
  }
}
