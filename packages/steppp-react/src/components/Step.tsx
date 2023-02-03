import { ReactNode } from "react";

interface StepProps {
  initialActive?: boolean;
  name?: string;
  children: ReactNode | ReactNode[];
}

export function Step({ children, initialActive, name, ...rest }: StepProps) {
  return (
    <section
      data-steppp-active={initialActive}
      data-steppp-name={name}
      {...rest}
    >
      {children}
    </section>
  );
}
