export function RadialGradientBackground() {
  return (
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        background: "radial-gradient(125% 125% at 50% 10%, #000 40%, #F97316 100%)",
      }}
    />
  );
}
