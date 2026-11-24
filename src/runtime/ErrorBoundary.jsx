import React from 'react';

export default class BlockErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(`[Web3Fiber] Block failed in zone "${this.props.zoneId || 'unknown'}":`, error);
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback || <div className="w3f-block-error" role="status">This content block could not be displayed.</div>;
    }
    return this.props.children;
  }
}
