// src/components/QuixlitLogo.tsx
import { cn } from "@/lib/utils";

interface QuixlitLogoProps extends React.SVGProps<SVGSVGElement> {
  // no extra props needed for now
}

export function QuixlitLogo({ className, ...props }: QuixlitLogoProps) {
  return (
    <div className={cn("quixlit-logo-animate", className)}>
      <svg
        width="32" // Increased base size for better visibility of pixel effect
        height="32"
        viewBox="0 0 16 16" // Keep viewBox smaller to draw "pixels" as larger blocks
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Quixlit Logo"
        {...props}
      >
        {/* Pixelated 'Q' shape */}
        {/* Outer Ring - using foreground for definition */}
        <rect x="3" y="1" width="10" height="1" fill="hsl(var(--foreground))" />
        <rect x="2" y="2" width="1" height="1" fill="hsl(var(--foreground))" />
        <rect x="13" y="2" width="1" height="1" fill="hsl(var(--foreground))" />
        <rect x="1" y="3" width="1" height="10" fill="hsl(var(--foreground))" />
        <rect x="14" y="3" width="1" height="10" fill="hsl(var(--foreground))" />
        <rect x="2" y="13" width="1" height="1" fill="hsl(var(--foreground))" />
        <rect x="13" y="13" width="1" height="1" fill="hsl(var(--foreground))" />
        <rect x="3" y="14" width="10" height="1" fill="hsl(var(--foreground))" />

        {/* Inner 'Q' fill - using primary color */}
        <rect className="logo-primary-fill" x="4" y="2" width="8" height="1" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="3" y="3" width="1" height="1" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="12" y="3" width="1" height="1" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="2" y="4" width="1" height="8" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="13" y="4" width="1" height="8" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="3" y="12" width="1" height="1" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="12" y="12" width="1" height="1" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="4" y="13" width="8" height="1" fill="hsl(var(--primary))" />

        {/* Inner Q space - using background */}
        <rect x="4" y="4" width="7" height="7" fill="hsl(var(--background))" /> {/* Adjusted size and position */}
        <rect x="3" y="4" width="1" height="7" fill="hsl(var(--background))" />
        <rect x="11" y="4" width="1" height="7" fill="hsl(var(--background))" />
        <rect x="4" y="3" width="7" height="1" fill="hsl(var(--background))" />
        <rect x="4" y="11" width="7" height="1" fill="hsl(var(--background))" />


        {/* Q's tail - primary color */}
        <rect className="logo-primary-fill" x="9" y="9" width="3" height="1" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="10" y="10" width="1" height="3" fill="hsl(var(--primary))" />
        <rect className="logo-primary-fill" x="11" y="12" width="2" height="1" fill="hsl(var(--primary))" />

         {/* Q's tail outline - foreground */}
        <rect x="8" y="8" width="1" height="3" fill="hsl(var(--foreground))" />
        <rect x="9" y="8" width="3" height="1" fill="hsl(var(--foreground))" />
        <rect x="12" y="9" width="1" height="1" fill="hsl(var(--foreground))" />

        <rect x="9" y="10" width="1" height="3" fill="hsl(var(--foreground))" />
        <rect x="11" y="10" width="1" height="1" fill="hsl(var(--foreground))" />

        <rect x="10" y="13" width="1" height="1" fill="hsl(var(--foreground))" />
        <rect x="11" y="11" width="2" height="1" fill="hsl(var(--foreground))" />
        <rect x="13" y="12" width="1" height="2" fill="hsl(var(--foreground))" />
        <rect x="12" y="13" width="1" height="1" fill="hsl(var(--foreground))" />


      </svg>
    </div>
  );
}
