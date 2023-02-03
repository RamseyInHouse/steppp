import { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode | ReactNode[];
}

export function Wrapper({ children, ...rest }: WrapperProps) {
  return (
    <div data-steppp-wrapper {...rest}>
      {children}
    </div>
  );
}
