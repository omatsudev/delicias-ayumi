// app.jsx — view router + Tweaks panel for Delicias Ayumi

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "ayumi",
  "fontPair": "cormorant-work",
  "dark": false,
  "density": "regular",
  "heroStyle": "editorial",
  "menuLayout": "card",
  "showAnnounce": true,
  "showAbout": true
}/*EDITMODE-END*/;

// Palette presets — each: [primary, fg, bg, surface, accent]
const PALETTES = {
  ayumi: {
    label: "Ayumi (rosa & turquesa)",
    primary:  "0.62 0.22 350",
    bg:       "0.985 0.018 90",
    surface:  "1 0.008 85",
    surface2: "0.95 0.04 350",
    line:     "0.86 0.06 350",
    lineSoft: "0.93 0.03 355",
    fg:       "0.28 0.06 350",
    fgSoft:   "0.46 0.06 350",
    fgMuted:  "0.62 0.03 0",
    accent:   "0.7 0.14 200",
    primarySoft: "0.94 0.06 350",
    accentSoft:  "0.92 0.07 200",
  },
  doceria: {
    label: "Doceria (rosa & manteiga)",
    primary:  "0.62 0.18 12",
    bg:       "0.985 0.012 85",
    surface:  "1 0.006 80",
    surface2: "0.95 0.025 60",
    line:     "0.86 0.04 30",
    lineSoft: "0.93 0.022 40",
    fg:       "0.22 0.04 20",
    fgSoft:   "0.42 0.03 20",
    fgMuted:  "0.6 0.02 30",
    accent:   "0.72 0.16 145",
    primarySoft: "0.94 0.05 15",
    accentSoft:  "0.93 0.07 145",
  },
  tropical: {
    label: "Tropical (coral & limão)",
    primary:  "0.66 0.2 30",
    bg:       "0.985 0.018 90",
    surface:  "1 0.008 85",
    surface2: "0.94 0.04 95",
    line:     "0.86 0.05 70",
    lineSoft: "0.93 0.025 80",
    fg:       "0.22 0.04 60",
    fgSoft:   "0.42 0.03 60",
    fgMuted:  "0.6 0.02 60",
    accent:   "0.7 0.18 195",
    primarySoft: "0.94 0.06 35",
    accentSoft:  "0.93 0.06 195",
  },
  serra: {
    label: "Serra (verde fresco)",
    primary:  "0.52 0.16 150",
    bg:       "0.97 0.014 110",
    surface:  "0.99 0.01 100",
    surface2: "0.94 0.03 130",
    line:     "0.86 0.04 120",
    lineSoft: "0.92 0.022 115",
    fg:       "0.22 0.03 140",
    fgSoft:   "0.4 0.03 140",
    fgMuted:  "0.58 0.025 130",
    accent:   "0.65 0.17 45",
    primarySoft: "0.93 0.06 150",
    accentSoft:  "0.94 0.07 60",
  },
  imperial: {
    label: "Imperial (vinho & ouro)",
    primary:  "0.42 0.18 18",
    bg:       "0.96 0.014 80",
    surface:  "0.99 0.008 80",
    surface2: "0.93 0.025 70",
    line:     "0.86 0.025 50",
    lineSoft: "0.92 0.018 65",
    fg:       "0.18 0.025 25",
    fgSoft:   "0.38 0.02 25",
    fgMuted:  "0.58 0.02 40",
    accent:   "0.72 0.16 85",
    primarySoft: "0.94 0.05 20",
    accentSoft:  "0.94 0.06 85",
  },
  terracotta: {
    label: "Terracota (terroso)",
    primary:  "0.55 0.14 35",
    bg:       "0.972 0.012 75",
    surface:  "0.985 0.008 80",
    surface2: "0.945 0.014 75",
    line:     "0.88 0.018 70",
    lineSoft: "0.93 0.014 72",
    fg:       "0.25 0.022 50",
    fgSoft:   "0.45 0.02 55",
    fgMuted:  "0.62 0.018 60",
    accent:   "0.6 0.09 145",
    primarySoft: "0.93 0.04 50",
    accentSoft:  "0.93 0.04 145",
  },
};

const FONT_PAIRS = {
  "caveat-work": {
    label: "Caveat + Work Sans",
    display: '"Caveat", "Sacramento", cursive',
    ui:      '"Work Sans", system-ui, sans-serif',
  },
  "cormorant-work": {
    label: "Cormorant + Work Sans",
    display: '"Cormorant Garamond", Georgia, serif',
    ui:      '"Work Sans", system-ui, sans-serif',
  },
  "playfair-dm": {
    label: "Playfair + DM Sans",
    display: '"Playfair Display", Georgia, serif',
    ui:      '"DM Sans", system-ui, sans-serif',
  },
  "manrope": {
    label: "Manrope (mono-família)",
    display: '"Manrope", system-ui, sans-serif',
    ui:      '"Manrope", system-ui, sans-serif',
  },
};

function applyPalette(name) {
  const p = PALETTES[name] || PALETTES.terracotta;
  const root = document.documentElement;
  root.style.setProperty("--c-primary", `oklch(${p.primary})`);
  root.style.setProperty("--c-primary-2", `oklch(${p.primary.split(" ").map((v, i) => i === 0 ? Math.max(0.3, parseFloat(v) - 0.1) : v).join(" ")})`);
  root.style.setProperty("--c-primary-soft", `oklch(${p.primarySoft})`);
  root.style.setProperty("--c-accent", `oklch(${p.accent})`);
  root.style.setProperty("--c-accent-soft", `oklch(${p.accentSoft})`);
  // Only override base tones in light mode (dark mode has its own scheme)
  if (!document.documentElement.dataset.dark || document.documentElement.dataset.dark === "false") {
    root.style.setProperty("--c-bg", `oklch(${p.bg})`);
    root.style.setProperty("--c-surface", `oklch(${p.surface})`);
    root.style.setProperty("--c-surface-2", `oklch(${p.surface2})`);
    root.style.setProperty("--c-line", `oklch(${p.line})`);
    root.style.setProperty("--c-line-soft", `oklch(${p.lineSoft})`);
    root.style.setProperty("--c-fg", `oklch(${p.fg})`);
    root.style.setProperty("--c-fg-soft", `oklch(${p.fgSoft})`);
    root.style.setProperty("--c-fg-muted", `oklch(${p.fgMuted})`);
  }
}

function applyFontPair(name) {
  const f = FONT_PAIRS[name] || FONT_PAIRS["cormorant-work"];
  document.documentElement.style.setProperty("--font-display", f.display);
  document.documentElement.style.setProperty("--font-ui", f.ui);
}

// ── App root ─────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const store = useStore();

  // View state — { name: 'home' | 'product' | 'cart' | 'admin', id?, page? }
  const [view, setView] = React.useState({ name: "home" });
  const [cart, setCart] = React.useState([]);

  // Apply tweaks
  React.useEffect(() => { applyPalette(t.palette); }, [t.palette, t.dark]);
  React.useEffect(() => { applyFontPair(t.fontPair); }, [t.fontPair]);
  React.useEffect(() => {
    document.documentElement.dataset.dark = String(!!t.dark);
    applyPalette(t.palette); // re-apply for dark/light switch
  }, [t.dark]);
  React.useEffect(() => { document.documentElement.dataset.density = t.density; }, [t.density]);

  // Scroll to top on view change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view.name, view.id, view.page]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const found = prev.find(c => c.id === product.id);
      if (found) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, {
        id: product.id, name: product.name, price: product.price, size: product.size,
        swatch: product.swatch, cat: product.cat, qty,
      }];
    });
  };

  const sectionsVisible = { announce: t.showAnnounce, about: t.showAbout };

  const isAdmin = view.name === "admin";
  const currentProduct = view.name === "product" ? store.state.products.find(p => p.id === view.id) : null;

  // Pack tweaks for storefront layout
  const tForStore = { ...t, menuLayout: t.menuLayout };

  return (
    <>
      {!isAdmin && (
        <Topbar view={view} setView={setView} cart={cart} sectionsVisible={sectionsVisible}/>
      )}

      {view.name === "home"    && <HomePage store={store} setView={(v) => {
        if (typeof v === "function") {
          // legacy support: setView used by menu-layout toggle
          const next = v(view);
          if (next.layout) setTweak("menuLayout", next.layout);
          else setView(next);
        } else setView(v);
      }} addToCart={addToCart} t={tForStore}/>}

      {view.name === "product" && currentProduct && (
        <ProductPage product={currentProduct} store={store} setView={setView} addToCart={addToCart}/>
      )}

      {view.name === "cart"    && <CartPage store={store} cart={cart} setCart={setCart} setView={setView}/>}

      {view.name === "admin"   && <AdminApp store={store} view={view} setView={setView} t={t}/>}

      {/* Tweaks Panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Identidade visual"/>
        <TweakSelect label="Paleta" value={t.palette}
                     options={Object.entries(PALETTES).map(([k, v]) => ({ value: k, label: v.label }))}
                     onChange={v => setTweak("palette", v)}/>
        <TweakSelect label="Tipografia" value={t.fontPair}
                     options={Object.entries(FONT_PAIRS).map(([k, v]) => ({ value: k, label: v.label }))}
                     onChange={v => setTweak("fontPair", v)}/>
        <TweakToggle label="Modo escuro" value={t.dark}
                     onChange={v => setTweak("dark", v)}/>
        <TweakRadio  label="Densidade" value={t.density}
                     options={["compact", "regular", "comfy"]}
                     onChange={v => setTweak("density", v)}/>

        <TweakSection label="Layout da loja"/>
        <TweakSelect label="Hero" value={t.heroStyle}
                     options={[
                       { value: "editorial", label: "Editorial (revista)" },
                       { value: "split",     label: "Split escuro" },
                       { value: "quiet",     label: "Quiet (centralizado)" },
                     ]}
                     onChange={v => setTweak("heroStyle", v)}/>
        <TweakRadio  label="Cardápio" value={t.menuLayout}
                     options={["card", "list"]}
                     onChange={v => setTweak("menuLayout", v)}/>

        <TweakSection label="Seções"/>
        <TweakToggle label="Faixa de anúncio" value={t.showAnnounce}
                     onChange={v => setTweak("showAnnounce", v)}/>
        <TweakToggle label='Seção "Sobre"' value={t.showAbout}
                     onChange={v => setTweak("showAbout", v)}/>

        <TweakSection label="Dados"/>
        <TweakButton label="Resetar dados mock"
                     onClick={() => { store.reset(); window.location.reload(); }}/>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App/>);
