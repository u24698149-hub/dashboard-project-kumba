import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Pickaxe,
  Truck,
  ShieldCheck,
  Leaf,
  Scale,
  Menu,
  X,
  ChevronDown,
  HardHat,
  Briefcase,
} from "lucide-react";
import logo from "@/assets/kumba-logo.png";
import type { DepartmentId } from "@/data/departments";
import { departments } from "@/data/departments";
import { cn } from "@/lib/utils";
import { useDisruption } from "@/context/DisruptionContext";

const deptIcons: Record<DepartmentId, React.ComponentType<{ className?: string }>> = {
  governance: Scale,
  operations: Truck,
  mining: Pickaxe,
  safety: ShieldCheck,
  sustainability: Leaf,
};

interface SidebarProps {
  active: DepartmentId;
  onChange: (id: DepartmentId) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(true);
  const { mode, setMode } = useDisruption();

  const content = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo header */}
      <div className="border-b border-sidebar-border bg-white px-4 py-4">
        <img
          src={logo}
          alt="Kumba Iron Ore"
          className="h-12 w-full object-contain"
        />
      </div>
      <div className="border-b border-sidebar-border px-5 py-3">
        <div className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-sidebar-primary">
          Strategic Innovation
        </div>
        <div className="text-[11px] text-sidebar-foreground/70">
          Kumba Iron Ore · Console
        </div>
      </div>

      {/* Mode toggle */}
      <div data-tour="mode-toggle" className="border-b border-sidebar-border px-3 py-3">
        <div className="mb-1.5 px-1 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/60">
          View
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-md bg-sidebar-accent p-1">
          <button
            onClick={() => { setMode("executive"); setMobileOpen(false); }}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-[11px] font-display font-bold uppercase tracking-wider transition-all",
              mode === "executive"
                ? "bg-[var(--gradient-gold)] text-sidebar-primary-foreground shadow-[var(--shadow-gold)]"
                : "text-sidebar-foreground/70 hover:text-sidebar-primary"
            )}
          >
            <Briefcase className="h-3.5 w-3.5" /> Executive
          </button>
          <button
            onClick={() => { setMode("frontline"); setMobileOpen(false); }}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-[11px] font-display font-bold uppercase tracking-wider transition-all",
              mode === "frontline"
                ? "bg-[var(--gradient-gold)] text-sidebar-primary-foreground shadow-[var(--shadow-gold)]"
                : "text-sidebar-foreground/70 hover:text-sidebar-primary"
            )}
          >
            <HardHat className="h-3.5 w-3.5" /> Frontline
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md bg-sidebar-accent px-3 py-2.5 text-sm font-medium text-sidebar-primary"
        >
          <LayoutDashboard className="h-4 w-4" />
          Innovation Dashboard
        </Link>
      </div>

      {/* Department switcher */}
      <div className="px-3 pb-4">
        <button
          onClick={() => setSwitcherOpen((s) => !s)}
          className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-display font-bold uppercase tracking-[0.18em] text-sidebar-foreground/60 hover:text-sidebar-primary"
        >
          Switch Department
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", switcherOpen && "rotate-180")}
          />
        </button>
        {switcherOpen && (
          <div className="mt-1 flex flex-col gap-1">
            {departments.map((d) => {
              const Icon = deptIcons[d.id];
              const isActive = d.id === active;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    onChange(d.id);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "group flex items-start gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-all",
                    isActive
                      ? "bg-[var(--gradient-gold)] text-sidebar-primary-foreground shadow-[var(--shadow-gold)]"
                      : "hover:bg-sidebar-accent hover:text-sidebar-primary"
                  )}
                >
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", isActive && "text-sidebar-primary-foreground")} />
                  <div className="min-w-0">
                    <div className={cn("font-display text-[13px] font-bold uppercase tracking-wide leading-tight", !isActive && "text-sidebar-foreground")}>
                      {d.name}
                    </div>
                    <div className={cn("truncate text-[11px]", isActive ? "text-sidebar-primary-foreground/85" : "text-sidebar-foreground/55")}>
                      {d.role}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-sidebar-border px-5 py-4 text-[11px] text-sidebar-foreground/60">
        <div className="font-display font-bold uppercase tracking-[0.16em] text-sidebar-primary/80">
          v1.0 · Pilot
        </div>
        <div>Strategic Innovation Console</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <header data-tour="mobile-header" className="sticky top-0 z-30 flex items-center justify-between border-b border-border px-3 py-2 lg:hidden bg-sky-950">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Kumba Iron Ore" className="h-9 w-auto object-contain" />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-navy hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 bg-transparent text-slate-50" />
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:border-r lg:border-sidebar-border">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-3 z-10 rounded p-2 text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
