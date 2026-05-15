import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  DollarSign,
  Calculator,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Visão geral" },
  { to: "/admin/produtos", icon: Package, label: "Produtos" },
  { to: "/admin/pedidos", icon: ClipboardList, label: "Pedidos" },
  { to: "/admin/caixa", icon: DollarSign, label: "Caixa" },
  { to: "/admin/calculadora", icon: Calculator, label: "Calculadora" },
  { to: "/admin/configuracoes", icon: Settings, label: "Configurações" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <aside
      className="w-60 shrink-0 flex flex-col h-full"
      style={{ background: "oklch(var(--c-surface))", borderRight: "1px solid oklch(var(--c-line-soft))" }}
    >
      {/* Logo */}
      <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "oklch(var(--c-line-soft))" }}>
        <div>
          <p className="font-script text-xl" style={{ color: "oklch(var(--c-primary))" }}>
            Delicias Ayumi
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(var(--c-fg-muted))" }}>
            GESTÃO
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-[oklch(var(--c-surface-2))]">
            <X size={16} style={{ color: "oklch(var(--c-fg-soft))" }} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-[oklch(var(--c-primary-soft))] text-[oklch(var(--c-primary))]"
                  : "text-[oklch(var(--c-fg-soft))] hover:bg-[oklch(var(--c-surface-2))] hover:text-[oklch(var(--c-fg))]"
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t flex flex-col gap-1" style={{ borderColor: "oklch(var(--c-line-soft))" }}>
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[oklch(var(--c-surface-2))]"
          style={{ color: "oklch(var(--c-fg-soft))" }}
        >
          <ExternalLink size={14} />
          Ver loja
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-50 w-full text-left"
          style={{ color: "oklch(var(--c-danger))" }}
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  );
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "oklch(var(--c-bg))" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Mobile topbar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 border-b"
          style={{
            background: "oklch(var(--c-surface))",
            borderColor: "oklch(var(--c-line-soft))",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[oklch(var(--c-surface-2))]"
          >
            <Menu size={18} style={{ color: "oklch(var(--c-fg))" }} />
          </button>
          <span className="font-script text-lg" style={{ color: "oklch(var(--c-primary))" }}>
            Delicias Ayumi
          </span>
        </div>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
