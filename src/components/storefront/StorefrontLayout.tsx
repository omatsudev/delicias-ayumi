import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";

export function StorefrontLayout() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(var(--c-bg))" }}>
      <Topbar />
      <main>
        <Outlet />
      </main>
      <footer
        className="mt-20 border-t py-10 text-center text-sm"
        style={{
          borderColor: "oklch(var(--c-line-soft))",
          color: "oklch(var(--c-fg-muted))",
        }}
      >
        <p className="font-script text-xl mb-2" style={{ color: "oklch(var(--c-primary))" }}>
          Delicias Ayumi
        </p>
        <p>Bolos, tortas e empadões artesanais · Petrópolis/RJ</p>
        <p className="mt-2">© {new Date().getFullYear()} Delicias Ayumi. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
