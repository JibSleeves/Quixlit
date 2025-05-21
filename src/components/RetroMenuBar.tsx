
"use client";

import { cn } from "@/lib/utils";

const menuItems = ["File", "Edit", "View", "AI", "Tools", "Plugins", "Help"];

export function RetroMenuBar() {
  return (
    <nav className="px-2 py-0.5 bg-card border-b-2 border-b-[hsl(var(--border-dark))] select-none print:hidden">
      <ul className="flex items-center space-x-1">
        {menuItems.map((item) => (
          <li key={item}>
            <button
              className={cn(
                "px-2 py-0.5 text-sm text-card-foreground rounded-sm",
                "hover:bg-accent hover:text-accent-foreground",
                "active:bg-accent/80"
                // Basic button styling, no real dropdowns for now
              )}
              onClick={() => {
                // Placeholder for future functionality
                console.log(`${item} menu clicked (not implemented)`);
              }}
            >
              <span className="underline-offset-2 group-hover:underline">{item.charAt(0)}</span>{item.substring(1)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
