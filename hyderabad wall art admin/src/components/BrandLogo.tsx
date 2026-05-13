import logo from "@/assets/logo.jpg";

export function BrandLogo({ size = 56, src = logo, alt = "Hyderabad Wall Arts logo" }: { size?: number; src?: string; alt?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-gold" style={{ width: size, height: size }}>
      <div className="absolute inset-0 bg-gradient-brand opacity-80" />
      <img src={src} alt={alt} className="relative z-10 h-full w-full object-cover" />
    </div>
  );
}
