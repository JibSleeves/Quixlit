"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RetroButton } from "@/components/RetroButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SettingsPanel({ isOpen, onOpenChange }: SettingsPanelProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-2 border-t-[hsl(var(--border-light))] border-l-[hsl(var(--border-light))] border-b-[hsl(var(--border-dark))] border-r-[hsl(var(--border-dark))] text-card-foreground w-[90vw] max-w-md">
        <DialogHeader className="border-b-2 border-b-[hsl(var(--border-dark))] bg-secondary text-secondary-foreground p-2 cursor-default">
          <DialogTitle className="font-bold select-none text-left">Control Panel</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-6">
          <DialogDescription className="text-sm text-muted-foreground">
            Adjust application settings here. Remember to save your changes!
          </DialogDescription>
          
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-foreground">API Key:</Label>
            <Input id="api-key" type="password" placeholder="Enter your API key" className="bg-input text-foreground border-[hsl(var(--border))] focus:border-primary" />
          </div>

          <div className="flex items-center justify-between space-y-2">
            <Label htmlFor="crt-effect" className="text-foreground">CRT Scanline Effect:</Label>
            <Switch id="crt-effect" className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted" />
          </div>

          <div className="flex items-center justify-between space-y-2">
            <Label htmlFor="system-sounds" className="text-foreground">System Sounds:</Label>
            <Switch id="system-sounds" defaultChecked className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted" />
          </div>
          
          <p className="text-xs text-muted-foreground">
            More settings coming soon... maybe a boot sound selector?
          </p>
        </div>
        <DialogFooter className="p-2 border-t-2 border-t-[hsl(var(--border-light))]">
          <RetroButton variant="default" onClick={() => onOpenChange(false)}>Cancel</RetroButton>
          <RetroButton variant="primary" onClick={() => onOpenChange(false)}>Save Changes</RetroButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
