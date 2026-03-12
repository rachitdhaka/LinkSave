interface BorderContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function BorderContainer({
  children,
  className = "",
}: BorderContainerProps) {
  return (
    <div className={`relative border border-neutral-800 ${className}`}>
      {/* Corner crosshairs */}
      <span className="absolute -top-1.75 -left-1.75 font-mono text-[10px] leading-none text-neutral-600 select-none pointer-events-none">
        +
      </span>
      <span className="absolute -top-1.75 -right-1.75 font-mono text-[10px] leading-none text-neutral-600 select-none pointer-events-none">
        +
      </span>
      <span className="absolute -bottom-1.75 -left-1.75 font-mono text-[10px] leading-none text-neutral-600 select-none pointer-events-none">
        +
      </span>
      <span className="absolute -bottom-1.75 -right-1.75 font-mono text-[10px] leading-none text-neutral-600 select-none pointer-events-none">
        +
      </span>
      {children}
    </div>
  );
}
