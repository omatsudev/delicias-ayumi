import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { MessageCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export function StorefrontLayout() {
  const settings = useSettings()
  return (
    <div className="min-h-screen" style={{ background: "oklch(var(--c-bg))" }}>
      <Topbar />
      <main>
        <Outlet />
      </main>

      <footer
        id="contato"
        className="mt-10"
        style={{ background: "oklch(var(--c-fg))", color: "oklch(var(--c-bg))" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <img src="/logo-ayumi.png" alt="Delicias Ayumi" className="h-16 w-auto" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ opacity: 0.7 }}>
              Doces e salgados artesanais para festas, eventos e dias comuns que merecem algo bom.
              Petrópolis, RJ.
            </p>
            <a
              href={`https://wa.me/${settings['contato.whatsapp']}?text=Olá! Gostaria de fazer uma encomenda.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-medium px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              <MessageCircle size={15} />
              (24) 98888-0000
            </a>
          </div>

          <div>
            <h5 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ opacity: 0.5 }}>
              Cardápio
            </h5>
            <ul className="flex flex-col gap-3 text-sm" style={{ opacity: 0.8 }}>
              <li>Bolos</li>
              <li>Tortas</li>
              <li>Empadões</li>
              <li>Encomendas para festas</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ opacity: 0.5 }}>
              Entrega
            </h5>
            <ul className="flex flex-col gap-3 text-sm" style={{ opacity: 0.8 }}>
              <li>Petrópolis · Centro</li>
              <li>Itaipava · Corrêas</li>
              <li>Quitandinha · Bingen</li>
              <li>Retirada no ateliê</li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h5 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ opacity: 0.5 }}>
              Contato
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-3 text-sm" style={{ opacity: 0.8 }}>
              <span>{settings['contato.whatsapp'].replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}</span>
              <span>{settings['contato.email']}</span>
              <span className="col-span-2 md:col-span-1">{settings['contato.endereco']}</span>
              <span>@{settings['contato.instagram']}</span>
            </div>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-wrap justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)", opacity: 0.45 }}
        >
          <span>© {new Date().getFullYear()} Delicias Ayumi · Petrópolis/RJ</span>
          <span>CNPJ 00.000.000/0001-00</span>
        </div>
      </footer>
    </div>
  );
}
