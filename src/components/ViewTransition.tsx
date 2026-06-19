import type { ReactNode } from "react";

// Stand-in for React's experimental <ViewTransition> (which Next bundled via
// the canary channel). Vite runs stable React, so we instead tag the element
// with a `view-transition-name` and rely on the browser's native View
// Transitions API, triggered by React Router's `viewTransition` link prop.
export function ViewTransition({
    name,
    children,
}: {
    name?: string;
    children: ReactNode;
}) {
    return (
        <div style={name ? { viewTransitionName: name } : undefined}>
            {children}
        </div>
    );
}
