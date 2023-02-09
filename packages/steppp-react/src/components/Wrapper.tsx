interface WrapperProps {
  children: JSX.Element[] | JSX.Element;
}

export function Wrapper({ children, ...rest }: WrapperProps) {
  return (
    <div data-steppp-wrapper {...rest}>
      {children}
    </div>
  );
}
