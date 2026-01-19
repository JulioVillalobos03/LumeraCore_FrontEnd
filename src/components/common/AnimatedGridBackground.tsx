interface Props {
  children: React.ReactNode;
}

export default function AnimatedGridBackground({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-(--bg-app)">
      {/* Grid */}
      <div className="absolute inset-0 animated-grid" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
