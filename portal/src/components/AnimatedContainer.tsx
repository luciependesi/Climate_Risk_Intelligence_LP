// src/components/animatedcontainer.tsx
// src/components/AnimatedContainer.tsx
import React from "react";

export function AnimatedContainer({
  children,
  keyId,
}: {
  children: React.ReactNode;
  keyId?: string;
}) {
  return (
    <div key={keyId} className="fade-in">
      {children}
    </div>
  );
}

// ⭐ Provide BOTH exports so ALL imports work
export default AnimatedContainer;