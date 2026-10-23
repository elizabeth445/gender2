import { Component, type PropsWithChildren } from 'react';
import { Agentation } from 'agentation';

// A failed development tool must not unmount the invitation.
class ToolBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function AgentationTools() {
  return (
    <ToolBoundary>
      <Agentation />
    </ToolBoundary>
  );
}
