import React, { useState, ReactNode } from "react"

interface CollapsibleProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

interface CollapsibleTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

interface CollapsibleContentProps {
  children: ReactNode;
}

export const Collapsible: React.FC<CollapsibleProps> = ({ children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div data-state={isOpen ? "open" : "closed"}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen } as any);
        }
        return child;
      })}
    </div>
  );
};

export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }> = ({
  children,
  asChild = false,
  isOpen = false,
  setIsOpen
}) => {
  const handleClick = () => {
    setIsOpen?.(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
};

export const CollapsibleContent: React.FC<CollapsibleContentProps & { isOpen?: boolean }> = ({ children, isOpen = false }) => {
  if (!isOpen) {
    return null;
  }

  return <div>{children}</div>;
};