import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, Menu, X } from "lucide-react";
import { useCartStore } from "../../store/cart";
import { useSettings } from "@/contexts/SettingsContext";

interface TopbarProps {
  showAnnounce?: boolean;
}

export function Topbar({ showAnnounce = true }: TopbarProps) {
  const itemCount = useCartStore((s) => s.itemCount());
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const settings = useSettings();

  return (
    <>
      {/* Faixa de anúncio */}
      {showAnnounce && (
        <div
          className="w-full py-2 px-4 text-center text-white text-xs font-medium"
          style={{ background: "oklch(var(--c-primary))", fontSize: "12.5px" }}
        >
          <MapPin size={12} className="inline mr-1.5 -mt-0.5" />
          {settings['announce.texto']}
        </div>
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          borderColor: "oklch(var(--c-line-soft))",
          backdropFilter: "saturate(140%) blur(12px)",
          backgroundColor: "oklch(var(--c-bg) / 0.85)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "oklch(var(--c-primary))" }}
            >
              A
            </div>
            <span
              className="font-script text-2xl leading-none"
              style={{ color: "oklch(var(--c-primary))" }}
            >
              Delicias Ayumi
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: "Cardápio", href: "/#menu" },
              { label: "Encomendas", href: "/#encomendas" },
              { label: "Sobre", href: "/#sobre" },
              { label: "Contato", href: "/#contato" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-[oklch(var(--c-primary))]"
                style={{ color: "oklch(var(--c-fg-soft))" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Botão sacola */}
            <button
              onClick={() => navigate("/carrinho")}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-85"
              style={{
                background: "oklch(var(--c-fg))",
                color: "oklch(var(--c-bg))",
              }}
              aria-label={`Sacola com ${itemCount} item(s)`}
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Sacola</span>
              {itemCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: "oklch(var(--c-primary))" }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Menu hamburguer mobile */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "oklch(var(--c-fg))" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
            style={{ borderColor: "oklch(var(--c-line-soft))", background: "oklch(var(--c-surface))" }}
          >
            {[
              { label: "Cardápio", href: "/#menu" },
              { label: "Encomendas", href: "/#encomendas" },
              { label: "Sobre", href: "/#sobre" },
              { label: "Contato", href: "/#contato" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium py-1"
                style={{ color: "oklch(var(--c-fg))" }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
