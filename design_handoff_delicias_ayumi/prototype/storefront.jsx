// storefront.jsx — customer-facing pages: home, product, cart, checkout

// ── Topbar / nav ─────────────────────────────────────────────────
const Topbar = ({ view, setView, cart, sectionsVisible }) => {
  const itemCount = cart.reduce((n, c) => n + c.qty, 0);
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "color-mix(in oklab, var(--c-bg) 88%, transparent)",
      backdropFilter: "saturate(140%) blur(12px)",
      borderBottom: "1px solid var(--c-line-soft)"
    }}>
      {sectionsVisible.announce &&
      <div style={{
        background: "var(--c-primary)", color: "#fff",
        textAlign: "center", padding: "8px 16px", fontSize: 12.5, letterSpacing: "0.03em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap",
        fontWeight: 500
      }}>
          <Icon name="pin" size={13} />
          Entregamos em toda Petrópolis · Retirada em Corrêas ♡
        </div>
      }
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 28px", maxWidth: 1240, margin: "0 auto", gap: 24
      }}>
        <button onClick={() => setView({ name: "home" })} style={{ display: "inline-flex" }}>
          <Logo size={36} withWordmark={false} />
          <span style={{ marginLeft: 10, display: "inline-flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{
              fontFamily: '"Caveat", "Sacramento", cursive',
              fontSize: 28, fontWeight: 700, color: "var(--c-primary)",
              whiteSpace: "nowrap"
            }}>Delicias Ayumi</span>
          </span>
        </button>
        <nav style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14 }}>
          <button onClick={() => setView({ name: "home" })} style={{ color: view.name === "home" ? "var(--c-fg)" : "var(--c-fg-soft)", fontWeight: 500 }}>Cardápio</button>
          <button onClick={() => setView({ name: "home", scrollTo: "encomendas" })} className="soft" style={{ fontWeight: 500 }}>Encomendas</button>
          <button onClick={() => setView({ name: "home", scrollTo: "sobre" })} className="soft" style={{ fontWeight: 500 }}>Sobre</button>
          <button onClick={() => setView({ name: "home", scrollTo: "contato" })} className="soft" style={{ fontWeight: 500 }}>Contato</button>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button variant="ghost" size="sm" icon="settings" onClick={() => setView({ name: "admin", page: "dashboard" })}>
            Admin
          </Button>
          <button onClick={() => setView({ name: "cart" })}
          style={{
            position: "relative", padding: "9px 14px",
            background: "var(--c-fg)", color: "var(--c-bg)",
            borderRadius: "var(--r-sm)", display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 500
          }}>
            <Icon name="cart" size={16} />
            Sacola
            {itemCount > 0 &&
            <span style={{
              background: "var(--c-primary)", color: "#fff", borderRadius: 999,
              minWidth: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600, padding: "0 6px"
            }}>{itemCount}</span>
            }
          </button>
        </div>
      </div>
    </header>);

};

// ── Hero variants ────────────────────────────────────────────────
const HeroEditorial = ({ setView, products }) => {
  const featured = products[0];
  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 28px 40px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "center"
      }}>
        <div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12,
            letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--c-primary)",
            fontWeight: 600, marginBottom: 20
          }}>
            <span style={{ width: 24, height: 1, background: "var(--c-primary)" }} />
            Feito à mão em Petrópolis
          </span>
          <h1 className="serif" style={{
            margin: 0, fontSize: "clamp(46px, 6vw, 84px)",
            fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.025em"
          }}>
            Bolos, tortas
            <br />
            <span style={{
              fontFamily: 'var(--font-script)',
              color: "var(--c-primary)",
              fontWeight: 700,
              display: "inline-block",
              transform: "rotate(-2deg)",
              transformOrigin: "left center",
              lineHeight: 0.9,
              padding: "0.1em 0"
            }}>e empadões</span>
            <br />
            <span style={{ color: "var(--c-fg-soft)" }}>de família.</span>
          </h1>
          <p className="soft" style={{
            margin: "28px 0 36px", fontSize: 18, maxWidth: 500, lineHeight: 1.55,
            textWrap: "pretty"
          }}>Receitas que atravessaram três gerações, preparadas no nosso ateliê em Corrêas. Encomende para sua mesa ou retire conosco.


          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button size="lg" icon="bag" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
              Ver cardápio
            </Button>
            <Button size="lg" variant="ghost" icon="wpp">
              Encomendar pelo WhatsApp
            </Button>
          </div>
          <div style={{ display: "flex", gap: 36, marginTop: 56, flexWrap: "wrap" }}>
            {[
            { k: "5+", v: "anos no forno", c: "var(--c-primary)" },
            { k: "+100", v: "clientes em Petrópolis", c: "var(--c-accent)" },
            { k: "100%", v: "ingredientes naturais", c: "var(--c-primary)" }].
            map((s) =>
            <div key={s.v}>
                <div className="serif" style={{ fontSize: 36, fontWeight: 600, color: s.c, lineHeight: 1 }}>{s.k}</div>
                <div className="soft" style={{ fontSize: 13, marginTop: 6 }}>{s.v}</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "relative", aspectRatio: "4/5" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "var(--c-primary-soft)",
            borderRadius: "var(--r-2xl)",
            transform: "rotate(-2.5deg) translate(10px, 10px)"
          }} />
          <div style={{
            position: "absolute", inset: 0, borderRadius: "var(--r-2xl)",
            overflow: "hidden", boxShadow: "var(--shadow-lg)"
          }}>
            <ProductImage product={featured} ratio="4/5" style={{ borderRadius: 0, width: "100%", height: "100%" }} />
          </div>
          <div style={{
            position: "absolute", left: -20, bottom: 30,
            background: "var(--c-surface)", border: "1px solid var(--c-line-soft)",
            borderRadius: "var(--r-md)", padding: "12px 16px",
            boxShadow: "var(--shadow-md)", display: "flex", alignItems: "center", gap: 10,
            fontSize: 13
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 999, background: "var(--c-accent-soft)",
              color: "var(--c-accent)", display: "grid", placeItems: "center"
            }}>
              <Icon name="star" size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>4.9 · 312 avaliações</div>
              <div className="soft" style={{ fontSize: 11 }}>Google · Instagram</div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

const HeroSplit = ({ setView, products }) =>
<section style={{
  background: "var(--c-fg)", color: "var(--c-bg)",
  padding: "80px 28px", position: "relative", overflow: "hidden"
}}>
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
      <div>
        <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-primary)" }}>Petrópolis · RJ</span>
        <h1 className="serif" style={{
        margin: "20px 0 24px", fontSize: "clamp(54px, 7vw, 96px)",
        fontWeight: 500, lineHeight: 0.95, letterSpacing: "-0.03em"
      }}>
          Mesa cheia,<br />
          <em style={{
          fontFamily: 'var(--font-script)', fontStyle: "normal",
          color: "var(--c-primary)", fontWeight: 700
        }}>coração</em> contente.
        </h1>
        <p style={{ fontSize: 18, opacity: 0.7, maxWidth: 480, lineHeight: 1.5 }}>
          Bolos, tortas e empadões artesanais para suas reuniões, festas
          e dias em que só o caseiro consola.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
          <Button size="lg" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
            Encomendar agora
          </Button>
          <Button size="lg" variant="ghost" style={{ borderColor: "rgba(255,255,255,0.2)", color: "var(--c-bg)" }}>
            Como funciona
          </Button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {products.slice(0, 4).map((p, i) =>
      <div key={p.id} style={{ aspectRatio: "1", transform: i % 2 ? "translateY(20px)" : "none" }}>
            <ProductImage product={p} ratio="1/1" style={{ width: "100%", height: "100%" }} />
          </div>
      )}
      </div>
    </div>
  </section>;


const HeroQuiet = ({ setView, products }) =>
<section style={{ maxWidth: 980, margin: "0 auto", padding: "100px 28px 60px", textAlign: "center" }}>
    <span style={{
    fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "var(--c-primary)", fontWeight: 600
  }}>Ateliê · Petrópolis</span>
    <h1 className="serif" style={{
    margin: "20px auto 28px", fontSize: "clamp(48px, 7vw, 96px)",
    fontWeight: 500, lineHeight: 1, letterSpacing: "-0.025em",
    maxWidth: 900, textWrap: "balance"
  }}>
      Bolos, tortas e empadões<br />
      <em style={{
      fontFamily: 'var(--font-script)', fontStyle: "normal",
      color: "var(--c-primary)", fontWeight: 700,
      display: "inline-block", padding: "0.1em 0"
    }}>como os da sua avó</em>
      <span style={{ display: "block" }}>— só que de verdade.</span>
    </h1>
    <p className="soft" style={{ fontSize: 18, maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.55, textWrap: "pretty" }}>
      Cada receita preparada do zero, com ingredientes da serra e o tempo necessário pra ficar boa.
    </p>
    <Button size="lg" iconRight="arrow" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
      Ver o cardápio
    </Button>
    <div style={{
    marginTop: 80, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24
  }}>
      {products.slice(0, 3).map((p) =>
    <ProductImage key={p.id} product={p} ratio="4/5" style={{ width: "100%" }} />
    )}
    </div>
  </section>;


// ── Category chips + product grid ────────────────────────────────
const CategoryChips = ({ value, onChange, categories }) =>
<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {categories.map((c) =>
  <button key={c} onClick={() => onChange(c)}
  style={{
    padding: "8px 16px",
    background: value === c ? "var(--c-fg)" : "var(--c-surface)",
    color: value === c ? "var(--c-bg)" : "var(--c-fg-soft)",
    border: `1px solid ${value === c ? "var(--c-fg)" : "var(--c-line-soft)"}`,
    borderRadius: 999, fontSize: 13, fontWeight: 500,
    transition: "all .15s ease"
  }}>
        {c}
      </button>
  )}
  </div>;


const ProductCard = ({ product, onOpen, onAdd, layout = "card" }) => {
  if (layout === "list") {
    return (
      <div onClick={() => onOpen(product.id)}
      style={{
        display: "grid", gridTemplateColumns: "140px 1fr auto", gap: 20, alignItems: "center",
        padding: "calc(14px * var(--space))",
        background: "var(--c-surface)", border: "1px solid var(--c-line-soft)",
        borderRadius: "var(--r-lg)", cursor: "pointer",
        transition: "border-color .15s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--c-line)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--c-line-soft)"}>
        <ProductImage product={product} ratio="1/1" />
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            {product.tags.slice(0, 2).map((t) => <Tag key={t} tone={t === "Mais pedido" ? "primary" : "neutral"}>{t}</Tag>)}
          </div>
          <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{product.name}</h3>
          <p className="soft" style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.45 }}>{product.short}</p>
          <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>{product.size}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="serif" style={{ fontSize: 26, fontWeight: 600 }}>{brl(product.price)}</div>
          <Button size="sm" icon="plus" style={{ marginTop: 10 }} onClick={(e) => {e.stopPropagation();onAdd(product);}}>Adicionar</Button>
        </div>
      </div>);

  }
  return (
    <Card padded={false} hoverable onClick={() => onOpen(product.id)}
    style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <ProductImage product={product} ratio="4/3" style={{ borderRadius: 0 }} />
        {product.tags[0] &&
        <Tag tone="primary" style={{
          position: "absolute", top: 12, left: 12,
          background: "var(--c-surface)", color: "var(--c-primary)"
        }}>{product.tags[0]}</Tag>
        }
      </div>
      <div style={{ padding: "calc(18px * var(--space))", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{product.name}</h3>
        <p className="soft" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, flex: 1 }}>{product.short}</p>
        <div className="muted" style={{ fontSize: 12 }}>{product.size}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span className="serif" style={{ fontSize: 24, fontWeight: 600 }}>{brl(product.price)}</span>
          <Button size="sm" icon="plus" onClick={(e) => {e.stopPropagation();onAdd(product);}}>Adicionar</Button>
        </div>
      </div>
    </Card>);

};

// ── Home Page ────────────────────────────────────────────────────
const HomePage = ({ store, setView, addToCart, t }) => {
  const [search, setSearch] = React.useState("");
  const [cat, setCat] = React.useState("Tudo");

  const products = store.state.products.filter((p) => p.active);
  const cats = ["Tudo", ...Array.from(new Set(products.map((p) => p.cat)))];
  const filtered = products.filter((p) => {
    if (cat !== "Tudo" && p.cat !== cat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const HeroComp = t.heroStyle === "split" ? HeroSplit :
  t.heroStyle === "quiet" ? HeroQuiet :
  HeroEditorial;

  return (
    <div className="view-fade">
      <HeroComp setView={setView} products={products} />

      {/* Trust band */}
      <section style={{ borderTop: "1px solid var(--c-line-soft)", borderBottom: "1px solid var(--c-line-soft)", background: "var(--c-surface)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 28px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {[
          { i: "leaf", t: "Sem conservantes", s: "Ingredientes frescos" },
          { i: "truck", t: "Entrega em Petrópolis", s: "Toda quarta e sábado" },
          { i: "package", t: "Retirada no ateliê", s: "Mosela, sem taxa" },
          { i: "wpp", t: "Atendimento humano", s: "WhatsApp direto" }].
          map((item) =>
          <div key={item.t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--c-bg)", color: "var(--c-primary)", display: "grid", placeItems: "center" }}>
                <Icon name={item.i} size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{item.t}</div>
                <div className="muted" style={{ fontSize: 12 }}>{item.s}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 36 }}>
          <SectionTitle eyebrow="Cardápio" title="O que está saindo do forno" sub="Encomendas com 48h de antecedência. Preços por unidade inteira." />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--c-surface)", border: "1px solid var(--c-line)",
              borderRadius: 999, padding: "8px 14px", width: 240
            }}>
              <Icon name="search" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar no cardápio…"
              style={{ flex: 1, background: "transparent", border: 0, outline: "none", fontSize: 14, minWidth: 0 }} />
            </div>
            <div style={{ display: "flex", border: "1px solid var(--c-line)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
              <button onClick={() => setView((v) => ({ ...v, layout: "card" }))}
              style={{ padding: "8px 10px", background: (t.menuLayout || "card") === "card" ? "var(--c-fg)" : "transparent", color: (t.menuLayout || "card") === "card" ? "var(--c-bg)" : "var(--c-fg-soft)" }}>
                <Icon name="grid" size={14} />
              </button>
              <button onClick={() => setView((v) => ({ ...v, layout: "list" }))}
              style={{ padding: "8px 10px", background: t.menuLayout === "list" ? "var(--c-fg)" : "transparent", color: t.menuLayout === "list" ? "var(--c-bg)" : "var(--c-fg-soft)" }}>
                <Icon name="list" size={14} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <CategoryChips value={cat} onChange={setCat} categories={cats} />
        </div>

        {t.menuLayout === "list" ?
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((p) =>
          <ProductCard key={p.id} product={p} layout="list"
          onOpen={(id) => setView({ name: "product", id })}
          onAdd={addToCart} />
          )}
          </div> :

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24
        }}>
            {filtered.map((p) =>
          <ProductCard key={p.id} product={p}
          onOpen={(id) => setView({ name: "product", id })}
          onAdd={addToCart} />
          )}
          </div>
        }

        {filtered.length === 0 &&
        <Card style={{ textAlign: "center", padding: 48 }}>
            <p className="soft">Nada por aqui ainda. Tente outro filtro.</p>
          </Card>
        }
      </section>

      {/* Encomendas / How it works */}
      <section id="encomendas" style={{ background: "var(--c-surface)", borderTop: "1px solid var(--c-line-soft)", borderBottom: "1px solid var(--c-line-soft)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 28px" }}>
          <SectionTitle eyebrow="Como funciona" title="Da nossa cozinha pra sua mesa" align="center" style={{ alignItems: "center", margin: "0 auto 48px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {[
            { n: "01", t: "Escolha", d: "Monte sua encomenda com pelo menos 48h de antecedência." },
            { n: "02", t: "Pague", d: "Pix, cartão ou na entrega — tanto faz pra gente." },
            { n: "03", t: "Preparamos", d: "Tudo feito do zero no nosso ateliê na Mosela." },
            { n: "04", t: "Chega aí", d: "Entrega em Petrópolis ou retirada no ateliê." }].
            map((s) =>
            <Card key={s.n}>
                <div className="serif" style={{ fontSize: 38, fontWeight: 600, color: "var(--c-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>{s.n}</div>
                <h4 className="serif" style={{ margin: "14px 0 8px", fontSize: 22, fontWeight: 600 }}>{s.t}</h4>
                <p className="soft" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{s.d}</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "center" }}>
          <div style={{ aspectRatio: "5/6", position: "relative" }}>
            <div className="ph-img" style={{
              position: "absolute", inset: 0, borderRadius: "var(--r-2xl)"
            }}>
              <span className="ph-label">FOTO AYUMI · ATELIÊ</span>
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="Quem faz" title="A receita é da minha avó. O ateliê é meu." sub="Sou a Ayumi. Há alguns anos, transformei a cozinha de casa em ateliê e nunca mais parei. Cada bolo sai daqui assinado por mim — e provado três vezes antes de te entregar." />
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Button variant="ghost" icon="insta">@delicias_ayumi</Button>
              <Button variant="ghost" icon="wpp">(24) 98888-0000</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / contato */}
      <footer id="contato" style={{ background: "var(--c-fg)", color: "var(--c-bg)", padding: "60px 28px 28px", marginTop: 40 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="assets/logo-ayumi.png" alt="Delicias Ayumi"
                   width="48" height="48"
                   style={{ width: 48, height: 48, borderRadius: "50%", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}/>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{
                  fontFamily: '"Caveat", "Sacramento", cursive',
                  fontSize: 32, fontWeight: 700,
                  color: "#fff", letterSpacing: "0.005em",
                }}>Delicias Ayumi</span>
                <span style={{
                  fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 500,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "oklch(0.85 0.1 200)", marginTop: 5,
                }}>Feito com amor ♡</span>
              </div>
            </div>
            <p style={{ marginTop: 18, opacity: 0.7, fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>
              Doces e salgados artesanais para festas, eventos e dias comuns que merecem algo bom.
              Petrópolis, RJ.
            </p>
          </div>
          <div>
            <h5 style={{ margin: 0, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6 }}>Cardápio</h5>
            <ul style={{ marginTop: 16, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, opacity: 0.85 }}>
              <li>Bolos</li><li>Tortas</li><li>Empadões</li><li>Encomendas para festas</li>
            </ul>
          </div>
          <div>
            <h5 style={{ margin: 0, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6 }}>Entrega</h5>
            <ul style={{ marginTop: 16, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, opacity: 0.85 }}>
              <li>Petrópolis · Centro</li>
              <li>Itaipava · Corrêas</li>
              <li>Quitandinha · Bingen</li>
              <li>Retirada no ateliê</li>
            </ul>
          </div>
          <div>
            <h5 style={{ margin: 0, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6 }}>Contato</h5>
            <ul style={{ marginTop: 16, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, opacity: 0.85 }}>
              <li>(24) 98888-0000</li>
              <li>oi@deliciasayumi.com.br</li>
              <li>R. Bom Pastor, 240 · Mosela</li>
              <li>@delicias_ayumi</li>
            </ul>
          </div>
        </div>
        <div style={{
          maxWidth: 1240, margin: "44px auto 0", paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          fontSize: 12, opacity: 0.5
        }}>
          <span>© 2026 Delicias Ayumi · Petrópolis/RJ</span>
          <span>CNPJ 00.000.000/0001-00</span>
        </div>
      </footer>
    </div>);

};

// ── Product detail page ──────────────────────────────────────────
const ProductPage = ({ product, store, setView, addToCart }) => {
  const [qty, setQty] = React.useState(1);
  const others = store.state.products.filter((p) => p.id !== product.id && p.cat === product.cat).slice(0, 3);

  return (
    <div className="view-fade" style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 28px 80px" }}>
      <button onClick={() => setView({ name: "home" })} className="soft" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 24 }}>
        <Icon name="back" size={14} /> Voltar ao cardápio
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ProductImage product={product} ratio="1/1" style={{ borderRadius: "var(--r-xl)" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[1, 2, 3].map((i) =>
            <ProductImage key={i} product={product} ratio="1/1" style={{ opacity: 0.85 }} />
            )}
          </div>
        </div>
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {product.tags.map((t) => <Tag key={t} tone={t === "Mais pedido" ? "primary" : "neutral"}>{t}</Tag>)}
          </div>
          <h1 className="serif" style={{ margin: 0, fontSize: 48, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{product.name}</h1>
          <p className="soft" style={{ margin: "16px 0 0", fontSize: 17, lineHeight: 1.6, textWrap: "pretty" }}>{product.short}</p>

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 28 }}>
            <span className="serif" style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em" }}>{brl(product.price)}</span>
            <span className="muted" style={{ fontSize: 14 }}>· {product.size}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--c-line)", borderRadius: "var(--r-sm)" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "10px 14px" }}><Icon name="minus" size={14} /></button>
              <span style={{ width: 38, textAlign: "center", fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ padding: "10px 14px" }}><Icon name="plus" size={14} /></button>
            </div>
            <Button size="lg" icon="bag" onClick={() => {addToCart(product, qty);setView({ name: "cart" });}} style={{ flex: 1 }}>
              Adicionar à sacola · {brl(product.price * qty)}
            </Button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 8 }}>
            <Card padded={false} style={{ padding: 16, display: "flex", gap: 12 }}>
              <Icon name="clock" size={22} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>48h para preparo</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Encomende com antecedência</div>
              </div>
            </Card>
            <Card padded={false} style={{ padding: 16, display: "flex", gap: 12 }}>
              <Icon name="truck" size={22} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Entrega em Petrópolis</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>A partir de R$ 8,00</div>
              </div>
            </Card>
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--c-line-soft)" }}>
            <h4 className="serif" style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Sobre o preparo</h4>
            <p className="soft" style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.7, textWrap: "pretty" }}>
              Massa preparada na hora, sem mistura industrial. Recheio com ingredientes frescos
              comprados na semana. Embalado em caixa kraft com tag personalizada.
              Validade de 3 dias refrigerado.
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      {others.length > 0 &&
      <div style={{ marginTop: 80 }}>
          <SectionTitle eyebrow="Da mesma categoria" title="Quem leva esse, gosta de" style={{ marginBottom: 24 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {others.map((p) =>
          <ProductCard key={p.id} product={p}
          onOpen={(id) => setView({ name: "product", id })}
          onAdd={addToCart} />
          )}
          </div>
        </div>
      }
    </div>);

};

// ── Cart + Checkout ──────────────────────────────────────────────
const CartPage = ({ store, cart, setCart, setView }) => {
  const [step, setStep] = React.useState("cart"); // cart | checkout | done
  const [bairro, setBairro] = React.useState(PETRO_BAIRROS[0].name);
  const [method, setMethod] = React.useState("entrega");
  const [form, setForm] = React.useState({ name: "", phone: "", cep: "", address: "", payment: "pix", notes: "" });

  const subtotal = cart.reduce((n, c) => n + c.qty * c.price, 0);
  const fee = method === "retirada" ? 0 : PETRO_BAIRROS.find((b) => b.name === bairro)?.fee || 0;
  const total = subtotal + fee;

  const updateQty = (id, q) => {
    setCart(cart.map((c) => c.id === id ? { ...c, qty: Math.max(1, q) } : c));
  };
  const remove = (id) => setCart(cart.filter((c) => c.id !== id));

  if (cart.length === 0 && step === "cart") {
    return (
      <div className="view-fade" style={{ maxWidth: 720, margin: "60px auto", padding: "0 28px", textAlign: "center" }}>
        <Card style={{ padding: 56 }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--c-surface-2)", margin: "0 auto 20px", display: "grid", placeItems: "center", color: "var(--c-fg-muted)" }}>
            <Icon name="bag" size={28} />
          </div>
          <h2 className="serif" style={{ margin: 0, fontSize: 32, fontWeight: 600 }}>Sua sacola está vazia</h2>
          <p className="soft" style={{ marginTop: 10 }}>Que tal um bolo pra alegrar a semana?</p>
          <Button size="lg" style={{ marginTop: 24 }} onClick={() => setView({ name: "home" })}>Ver cardápio</Button>
        </Card>
      </div>);

  }

  if (step === "done") {
    return (
      <div className="view-fade" style={{ maxWidth: 720, margin: "60px auto", padding: "0 28px", textAlign: "center" }}>
        <Card style={{ padding: 56 }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--c-accent-soft)", color: "var(--c-accent)", margin: "0 auto 20px", display: "grid", placeItems: "center" }}>
            <Icon name="check" size={32} />
          </div>
          <h2 className="serif" style={{ margin: 0, fontSize: 36, fontWeight: 600 }}>Pedido confirmado!</h2>
          <p className="soft" style={{ marginTop: 10, fontSize: 15 }}>
            A Ayumi vai te chamar no WhatsApp em instantes para confirmar a data de entrega.
          </p>
          <Card style={{ marginTop: 28, textAlign: "left", background: "var(--c-surface-2)", padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Pedido</span>
              <span className="mono" style={{ fontSize: 13 }}>#2042</span>
            </div>
            <div className="serif" style={{ fontSize: 28, fontWeight: 600, marginTop: 6 }}>{brl(total)}</div>
            <div className="soft" style={{ fontSize: 13, marginTop: 4 }}>{method === "retirada" ? "Retirada no ateliê" : "Entrega em " + bairro}</div>
          </Card>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
            <Button variant="ghost" onClick={() => {setCart([]);setView({ name: "home" });}}>Voltar ao início</Button>
            <Button icon="wpp">Abrir WhatsApp</Button>
          </div>
        </Card>
      </div>);

  }

  return (
    <div className="view-fade" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 80px" }}>
      <button onClick={() => setView({ name: "home" })} className="soft" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 18 }}>
        <Icon name="back" size={14} /> Continuar comprando
      </button>
      <h1 className="serif" style={{ margin: "0 0 28px", fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em" }}>
        {step === "cart" ? "Sua sacola" : "Finalizar pedido"}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 28, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {step === "cart" && cart.map((item) =>
          <Card key={item.id} padded={false}
          style={{ display: "grid", gridTemplateColumns: "100px 1fr auto", gap: 16, padding: 14, alignItems: "center" }}>
              <ProductImage product={item} ratio="1/1" />
              <div>
                <h3 className="serif" style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>{item.name}</h3>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{item.size}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--c-line)", borderRadius: "var(--r-sm)" }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ padding: "6px 10px" }}><Icon name="minus" size={12} /></button>
                    <span style={{ minWidth: 28, textAlign: "center", fontSize: 13, fontWeight: 600 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ padding: "6px 10px" }}><Icon name="plus" size={12} /></button>
                  </div>
                  <button onClick={() => remove(item.id)} className="muted" style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Icon name="trash" size={13} /> Remover
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>{brl(item.price * item.qty)}</div>
                <div className="muted" style={{ fontSize: 12 }}>{brl(item.price)}/un</div>
              </div>
            </Card>
          )}

          {step === "checkout" &&
          <>
              <Card>
                <h3 className="serif" style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 600 }}>Dados de contato</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input label="Nome completo" placeholder="Como devo chamar?" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input label="WhatsApp" placeholder="(24) 9 0000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </Card>

              <Card>
                <h3 className="serif" style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 600 }}>Entrega</h3>
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  {[
                { v: "entrega", l: "Entrega em Petrópolis", i: "truck" },
                { v: "retirada", l: "Retirar no ateliê (grátis)", i: "package" }].
                map((opt) =>
                <button key={opt.v} onClick={() => setMethod(opt.v)}
                style={{
                  flex: 1, padding: 14, textAlign: "left",
                  border: `2px solid ${method === opt.v ? "var(--c-primary)" : "var(--c-line-soft)"}`,
                  background: method === opt.v ? "var(--c-primary-soft)" : "var(--c-surface)",
                  borderRadius: "var(--r-md)",
                  display: "flex", gap: 12, alignItems: "center"
                }}>
                      <Icon name={opt.i} size={20} />
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{opt.l}</span>
                    </button>
                )}
                </div>

                {method === "entrega" ?
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12 }}>
                    <Input label="CEP" placeholder="25600-000" value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} />
                    <Select label="Bairro" value={bairro} onChange={setBairro}
                options={PETRO_BAIRROS.map((b) => ({ value: b.name, label: `${b.name} — ${brl(b.fee)} · ${b.km}km` }))} />
                    <Input label="Endereço" wrapperStyle={{ gridColumn: "1 / -1" }} placeholder="Rua, número, complemento" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div> :

              <div style={{
                display: "flex", gap: 16, padding: 16,
                background: "var(--c-surface-2)", borderRadius: "var(--r-md)"
              }}>
                    <Icon name="pin" size={22} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Ateliê Delicias Ayumi</div>
                      <div className="soft" style={{ fontSize: 13, marginTop: 4 }}>R. Bom Pastor, 240 — Mosela, Petrópolis/RJ</div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>Retiradas: quartas e sábados, das 14h às 18h</div>
                    </div>
                  </div>
              }
              </Card>

              <Card>
                <h3 className="serif" style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 600 }}>Pagamento</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {[
                { v: "pix", l: "Pix", s: "Desconto de 5%" },
                { v: "cartao", l: "Cartão", s: "Crédito ou débito" },
                { v: "dinheiro", l: "Dinheiro", s: "Na entrega" }].
                map((opt) =>
                <button key={opt.v} onClick={() => setForm({ ...form, payment: opt.v })}
                style={{
                  padding: 14, textAlign: "left",
                  border: `2px solid ${form.payment === opt.v ? "var(--c-primary)" : "var(--c-line-soft)"}`,
                  background: form.payment === opt.v ? "var(--c-primary-soft)" : "var(--c-surface)",
                  borderRadius: "var(--r-md)"
                }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.l}</div>
                      <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{opt.s}</div>
                    </button>
                )}
                </div>
                <Textarea label="Observações (opcional)" rows={2} placeholder="Alguma alergia, data preferida, recado..."
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{ marginTop: 14 }} />
              </Card>
            </>
          }
        </div>

        {/* Summary */}
        <Card style={{ position: "sticky", top: 100 }}>
          <h3 className="serif" style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 600 }}>Resumo</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            {cart.map((c) =>
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span className="soft">{c.qty}× {c.name}</span>
                <span>{brl(c.qty * c.price)}</span>
              </div>
            )}
          </div>
          <div style={{ height: 1, background: "var(--c-line-soft)", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span className="soft">Subtotal</span>
            <span>{brl(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 8 }}>
            <span className="soft">{method === "retirada" ? "Retirada" : "Entrega · " + bairro}</span>
            <span>{fee === 0 ? "Grátis" : brl(fee)}</span>
          </div>
          <div style={{ height: 1, background: "var(--c-line-soft)", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Total</span>
            <span className="serif" style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em" }}>{brl(total)}</span>
          </div>

          {step === "cart" ?
          <Button size="lg" full iconRight="arrow" style={{ marginTop: 18 }} onClick={() => setStep("checkout")}>
              Ir para o checkout
            </Button> :

          <Button size="lg" full icon="check" style={{ marginTop: 18 }} onClick={() => setStep("done")}>
              Confirmar pedido
            </Button>
          }
          <div className="muted" style={{ fontSize: 11, marginTop: 12, textAlign: "center", lineHeight: 1.5 }}>
            Atendimento humano por WhatsApp · Não cobramos taxa de serviço
          </div>
        </Card>
      </div>
    </div>);

};

Object.assign(window, { Topbar, HomePage, ProductPage, CartPage });