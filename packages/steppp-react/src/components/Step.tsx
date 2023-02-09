interface StepProps {
  initialActive?: boolean;
  name?: string;
  children: JSX.Element[] | JSX.Element | (string | JSX.Element)[] | string;
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
