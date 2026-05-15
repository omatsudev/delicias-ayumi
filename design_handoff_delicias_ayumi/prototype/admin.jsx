// admin.jsx — admin dashboard: products CRUD, orders, cash flow, price calculator

// ── Sidebar ──────────────────────────────────────────────────────
const AdminSidebar = ({ page, setPage, setView }) => {
  const items = [
    { id: "dashboard",  label: "Visão geral",      icon: "home" },
    { id: "products",   label: "Produtos",         icon: "box" },
    { id: "orders",     label: "Pedidos",          icon: "receipt" },
    { id: "cash",       label: "Controle de caixa",icon: "cash" },
    { id: "calculator", label: "Calculadora",      icon: "calc" },
  ];
  return (
    <aside style={{
      width: 240, flexShrink: 0, background: "var(--c-surface)",
      borderRight: "1px solid var(--c-line-soft)",
      display: "flex", flexDirection: "column", padding: "22px 16px",
      position: "sticky", top: 0, height: "100vh",
    }}>
      <button onClick={() => setView({ name: "home" })} style={{ marginBottom: 28, padding: "0 6px", display: "flex", alignItems: "center", gap: 10 }}>
        <Logo size={36} withWordmark={false}/>
        <span style={{
          fontFamily: '"Caveat", "Sacramento", cursive',
          fontSize: 26, fontWeight: 700, color: "var(--c-primary)",
          lineHeight: 1,
        }}>Delicias Ayumi</span>
      </button>
      <div className="muted" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", padding: "0 12px", marginBottom: 8 }}>
        Gestão
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: "var(--r-sm)",
                    background: page === item.id ? "var(--c-primary-soft)" : "transparent",
                    color: page === item.id ? "var(--c-primary)" : "var(--c-fg-soft)",
                    fontSize: 14, fontWeight: page === item.id ? 600 : 500,
                    textAlign: "left",
                  }}>
            <Icon name={item.icon} size={17}/>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1 }}/>
      <Card padded={false} style={{ padding: 14, background: "var(--c-surface-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 999,
            background: "var(--c-primary)", color: "#fff",
            display: "grid", placeItems: "center",
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16,
          }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Ayumi</div>
            <div className="muted" style={{ fontSize: 11 }}>Administradora</div>
          </div>
        </div>
      </Card>
      <button onClick={() => setView({ name: "home" })}
              style={{
                marginTop: 10, padding: "10px 12px", fontSize: 13,
                color: "var(--c-fg-muted)", display: "flex", alignItems: "center", gap: 8,
              }}>
        <Icon name="arrow" size={14} style={{ transform: "rotate(180deg)" }}/>
        Voltar à loja
      </button>
    </aside>
  );
};

// ── Topbar (admin) ───────────────────────────────────────────────
const AdminTopbar = ({ title, subtitle, actions }) => (
  <header style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "24px 32px", borderBottom: "1px solid var(--c-line-soft)",
    background: "var(--c-bg)", position: "sticky", top: 0, zIndex: 20,
  }}>
    <div>
      <h1 className="serif" style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: "-0.015em" }}>{title}</h1>
      {subtitle && <p className="soft" style={{ margin: "4px 0 0", fontSize: 13.5 }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
  </header>
);

// ── Dashboard / Visão geral ──────────────────────────────────────
const DashboardPage = ({ store, setPage, t }) => {
  const { products, orders, cash, revenue } = store.state;
  const todayIn = cash.filter(c => c.when.startsWith("Hoje") && c.type === "in").reduce((n, c) => n + c.amount, 0);
  const todayOut = cash.filter(c => c.when.startsWith("Hoje") && c.type === "out").reduce((n, c) => n + c.amount, 0);
  const balance = todayIn - todayOut;
  const activeOrders = orders.filter(o => o.status !== "Entregue").length;
  const totalRev = revenue.reduce((n, v) => n + v, 0);
  const avgTicket = orders.reduce((n, o) => n + o.total, 0) / orders.length;

  // Top products
  const topProducts = [...products].slice(0, 4).map((p, i) => ({
    ...p, sold: [28, 19, 14, 11][i], rev: p.price * [28, 19, 14, 11][i],
  }));

  return (
    <div className="view-fade" style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <Stat label="Saldo de hoje" value={brl(balance)} delta={`+${brl(todayIn)} entradas`} icon="cash"/>
        <Stat label="Pedidos ativos" value={activeOrders} caption="em produção ou entrega" icon="receipt"/>
        <Stat label="Faturamento 14d" value={brlShort(totalRev)} delta="+18% vs anterior" icon="chart"/>
        <Stat label="Ticket médio" value={brl(avgTicket)} caption="últimos 7 pedidos" icon="star"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
            <div>
              <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Faturamento por dia</h3>
              <p className="muted" style={{ margin: "2px 0 0", fontSize: 12 }}>Últimos 14 dias · em reais</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["7d", "14d", "30d"].map((p, i) => (
                <button key={p} style={{
                  padding: "5px 12px", fontSize: 12, borderRadius: "var(--r-sm)",
                  background: i === 1 ? "var(--c-fg)" : "transparent",
                  color: i === 1 ? "var(--c-bg)" : "var(--c-fg-soft)",
                  border: "1px solid " + (i === 1 ? "var(--c-fg)" : "var(--c-line)"),
                }}>{p}</button>
              ))}
            </div>
          </div>
          <RevenueChart data={revenue}/>
        </Card>

        <Card>
          <h3 className="serif" style={{ margin: "0 0 18px", fontSize: 22, fontWeight: 600 }}>Mais vendidos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {topProducts.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, color: "var(--c-fg-muted)", fontSize: 12, fontWeight: 600 }}>0{i + 1}</div>
                <div style={{ width: 44, height: 44, borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                  <ProductImage product={p} ratio="1/1" style={{ borderRadius: 0 }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{p.sold} vendidos</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{brl(p.rev)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Pedidos recentes</h3>
          <Button variant="ghost" size="sm" iconRight="arrow" onClick={() => setPage("orders")}>Ver todos</Button>
        </div>
        <OrderTable orders={orders.slice(0, 5)} store={store} compact/>
      </Card>
    </div>
  );
};

// ── Revenue chart (SVG) ──────────────────────────────────────────
const RevenueChart = ({ data }) => {
  const w = 700, h = 220, p = 28;
  const max = Math.max(...data) * 1.1;
  const x = i => p + (i / (data.length - 1)) * (w - 2 * p);
  const y = v => h - p - (v / max) * (h - 2 * p);
  const pts = data.map((v, i) => [x(i), y(v)]);
  const path = pts.map((pt, i) => (i === 0 ? "M" : "L") + pt[0].toFixed(1) + " " + pt[1].toFixed(1)).join(" ");
  const area = path + ` L ${x(data.length - 1)} ${h - p} L ${x(0)} ${h - p} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 240 }}>
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--c-primary)" stopOpacity="0.22"/>
          <stop offset="1" stopColor="var(--c-primary)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map(g => (
        <line key={g} x1={p} x2={w - p} y1={p + g * (h - 2 * p)} y2={p + g * (h - 2 * p)}
              stroke="var(--c-line-soft)" strokeWidth="1" strokeDasharray={g === 1 ? "0" : "3 4"}/>
      ))}
      <path d={area} fill="url(#rev-fill)"/>
      <path d={path} fill="none" stroke="var(--c-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((pt, i) => (
        <circle key={i} cx={pt[0]} cy={pt[1]} r={i === pts.length - 1 ? 5 : 2.5}
                fill={i === pts.length - 1 ? "var(--c-primary)" : "var(--c-surface)"}
                stroke="var(--c-primary)" strokeWidth="1.5"/>
      ))}
      {data.map((_, i) => i % 2 === 0 && (
        <text key={i} x={x(i)} y={h - 6} textAnchor="middle"
              fill="var(--c-fg-muted)" fontSize="10" fontFamily="var(--font-mono)">
          {`d${i + 1}`}
        </text>
      ))}
    </svg>
  );
};

// ── Orders table (used in dashboard + orders page) ───────────────
const STATUS_TONES = {
  "Em produção":         "warn",
  "Saiu p/ entrega":     "primary",
  "Pronto p/ retirada":  "accent",
  "Entregue":            "neutral",
};

const OrderTable = ({ orders, store, compact }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--c-fg-muted)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <th style={{ padding: "10px 12px 12px", fontWeight: 500 }}>Pedido</th>
          <th style={{ padding: "10px 12px 12px", fontWeight: 500 }}>Cliente</th>
          {!compact && <th style={{ padding: "10px 12px 12px", fontWeight: 500 }}>Bairro</th>}
          <th style={{ padding: "10px 12px 12px", fontWeight: 500 }}>Itens</th>
          <th style={{ padding: "10px 12px 12px", fontWeight: 500 }}>Total</th>
          <th style={{ padding: "10px 12px 12px", fontWeight: 500 }}>Status</th>
          {!compact && <th style={{ padding: "10px 12px 12px", fontWeight: 500 }}>Quando</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.id} style={{ borderTop: "1px solid var(--c-line-soft)" }}>
            <td style={{ padding: "12px" }} className="mono">{o.id}</td>
            <td style={{ padding: "12px", fontWeight: 500 }}>{o.customer}</td>
            {!compact && <td style={{ padding: "12px" }} className="soft">{o.bairro}</td>}
            <td style={{ padding: "12px" }} className="soft">{o.items}</td>
            <td style={{ padding: "12px", fontWeight: 600 }}>{brl(o.total)}</td>
            <td style={{ padding: "12px" }}>
              <Tag tone={STATUS_TONES[o.status]}>{o.status}</Tag>
            </td>
            {!compact && <td style={{ padding: "12px" }} className="muted">{o.when}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Products: list + CRUD ────────────────────────────────────────
const ProductsPage = ({ store }) => {
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState(null); // null | "new" | product
  const [confirmDel, setConfirmDel] = React.useState(null);

  const filtered = store.state.products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-fade">
      <AdminTopbar
        title="Produtos"
        subtitle={`${store.state.products.length} itens no cardápio`}
        actions={
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--c-surface)", border: "1px solid var(--c-line)",
              borderRadius: "var(--r-sm)", padding: "0 12px", height: 40,
            }}>
              <Icon name="search" size={15}/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                     placeholder="Buscar produto…"
                     style={{ width: 200, background: "transparent", border: 0, outline: "none", fontSize: 13 }}/>
            </div>
            <Button icon="plus" onClick={() => setEditing("new")}>Novo produto</Button>
          </>
        }
      />
      <div style={{ padding: "28px 32px" }}>
        <Card padded={false}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--c-fg-muted)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <th style={{ padding: "14px 16px", fontWeight: 500 }}>Produto</th>
                <th style={{ padding: "14px 16px", fontWeight: 500 }}>Categoria</th>
                <th style={{ padding: "14px 16px", fontWeight: 500 }}>Preço</th>
                <th style={{ padding: "14px 16px", fontWeight: 500 }}>Custo</th>
                <th style={{ padding: "14px 16px", fontWeight: 500 }}>Margem</th>
                <th style={{ padding: "14px 16px", fontWeight: 500 }}>Estoque</th>
                <th style={{ padding: "14px 16px", fontWeight: 500 }}>Status</th>
                <th style={{ padding: "14px 16px", fontWeight: 500, width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const margin = ((p.price - p.cost) / p.price) * 100;
                return (
                  <tr key={p.id} style={{ borderTop: "1px solid var(--c-line-soft)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "var(--r-sm)", overflow: "hidden", flexShrink: 0 }}>
                          <ProductImage product={p} ratio="1/1" style={{ borderRadius: 0 }}/>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div className="muted" style={{ fontSize: 11 }}>{p.size}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><Tag>{p.cat}</Tag></td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{brl(p.price)}</td>
                    <td style={{ padding: "12px 16px" }} className="soft">{brl(p.cost)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: margin > 60 ? "var(--c-accent)" : margin > 40 ? "var(--c-fg)" : "var(--c-warn)" }}>
                        {margin.toFixed(0)}%
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: p.stock < 5 ? "var(--c-danger)" : "var(--c-fg)" }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => store.updateProduct(p.id, { active: !p.active })}
                              style={{
                                width: 36, height: 20, borderRadius: 999,
                                background: p.active ? "var(--c-accent)" : "var(--c-line)",
                                position: "relative", transition: "background .2s",
                              }}>
                        <span style={{
                          position: "absolute", top: 2, left: p.active ? 18 : 2,
                          width: 16, height: 16, borderRadius: 999, background: "#fff",
                          transition: "left .2s",
                        }}/>
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setEditing(p)}
                                style={{ padding: 6, borderRadius: 6, color: "var(--c-fg-soft)" }}
                                title="Editar">
                          <Icon name="edit" size={15}/>
                        </button>
                        <button onClick={() => setConfirmDel(p)}
                                style={{ padding: 6, borderRadius: 6, color: "var(--c-danger)" }}
                                title="Excluir">
                          <Icon name="trash" size={15}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: "center" }} className="muted">Nenhum produto encontrado.</div>
          )}
        </Card>
      </div>

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={data => {
            if (editing === "new") store.addProduct(data);
            else store.updateProduct(editing.id, data);
            setEditing(null);
          }}/>
      )}

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Excluir produto?"
             footer={
               <>
                 <Button variant="ghost" onClick={() => setConfirmDel(null)}>Cancelar</Button>
                 <Button variant="danger" onClick={() => { store.deleteProduct(confirmDel.id); setConfirmDel(null); }}>
                   Sim, excluir
                 </Button>
               </>
             }>
        <p>O produto <strong>{confirmDel?.name}</strong> será removido do cardápio. Essa ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

// ── Product form (create/edit) ───────────────────────────────────
const ProductForm = ({ product, onClose, onSave }) => {
  const [form, setForm] = React.useState(product || {
    name: "", cat: "Bolos", short: "", price: 0, cost: 0, size: "",
    tags: [], stock: 0, active: true, swatch: ["#f4a261", "#a0522d", "#fff3d6"],
  });
  const margin = form.price > 0 ? ((form.price - form.cost) / form.price) * 100 : 0;

  return (
    <Modal open onClose={onClose} title={product ? "Editar produto" : "Novo produto"} width={680}
           footer={
             <>
               <Button variant="ghost" onClick={onClose}>Cancelar</Button>
               <Button onClick={() => onSave(form)} disabled={!form.name.trim()}>Salvar</Button>
             </>
           }>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input label="Nome do produto" placeholder="Ex: Bolo de Brigadeiro"
               value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Select label="Categoria" value={form.cat} onChange={v => setForm({ ...form, cat: v })}
                  options={["Bolos", "Tortas", "Empadões"]}/>
          <Input label="Tamanho / rendimento" placeholder="Serve 15 pessoas · 1,8 kg"
                 value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}/>
        </div>
        <Textarea label="Descrição curta" rows={2}
                  value={form.short} onChange={e => setForm({ ...form, short: e.target.value })}/>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Input label="Preço de venda" prefix="R$" type="number" step="0.01"
                 value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}/>
          <Input label="Custo" prefix="R$" type="number" step="0.01"
                 value={form.cost} onChange={e => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}/>
          <Input label="Estoque" type="number" suffix="un"
                 value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}/>
        </div>

        <div style={{
          padding: 14, background: "var(--c-surface-2)", borderRadius: "var(--r-sm)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 13 }} className="soft">Margem calculada</span>
          <span className="serif" style={{ fontSize: 24, fontWeight: 600, color: margin > 60 ? "var(--c-accent)" : margin > 40 ? "var(--c-fg)" : "var(--c-warn)" }}>
            {margin.toFixed(1)}%
          </span>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "var(--c-fg-soft)", marginBottom: 8, display: "block" }}>
            Paleta da imagem (placeholder)
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["#f4a261", "#a0522d", "#fff3d6"],
              ["#3a1f12", "#f8eede", "#d4af7a"],
              ["#f9e98a", "#9ad36a", "#fffae0"],
              ["#d62246", "#f7c8c8", "#fff5e8"],
              ["#f4c95d", "#c47628", "#fff1c6"],
              ["#e8d878", "#6ea049", "#fcf7d0"],
              ["#e8b16a", "#2c1305", "#fff0c8"],
              ["#9b6633", "#f5d9a8", "#fff5e0"],
              ["#ff8fab", "#cc4778", "#fff1f5"],
              ["#7ec4cf", "#3d6b7a", "#e8f5f7"],
            ].map((sw, i) => (
              <button key={i} onClick={() => setForm({ ...form, swatch: sw })}
                      style={{
                        width: 40, height: 40, borderRadius: "var(--r-sm)",
                        background: `linear-gradient(135deg, ${sw[2]} 0%, ${sw[0]} 50%, ${sw[1]} 100%)`,
                        border: form.swatch?.[0] === sw[0] ? "2px solid var(--c-fg)" : "2px solid transparent",
                      }}/>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ── Orders page ──────────────────────────────────────────────────
const OrdersPage = ({ store }) => {
  const [filter, setFilter] = React.useState("Todos");
  const tabs = ["Todos", "Em produção", "Saiu p/ entrega", "Pronto p/ retirada", "Entregue"];
  const filtered = filter === "Todos" ? store.state.orders : store.state.orders.filter(o => o.status === filter);

  return (
    <div className="view-fade">
      <AdminTopbar title="Pedidos" subtitle={`${store.state.orders.length} pedidos no total`}/>
      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)}
                    style={{
                      padding: "8px 16px",
                      background: filter === t ? "var(--c-fg)" : "var(--c-surface)",
                      color: filter === t ? "var(--c-bg)" : "var(--c-fg-soft)",
                      border: `1px solid ${filter === t ? "var(--c-fg)" : "var(--c-line-soft)"}`,
                      borderRadius: 999, fontSize: 13, fontWeight: 500,
                    }}>
              {t} {filter !== t && <span className="muted" style={{ marginLeft: 4 }}>({t === "Todos" ? store.state.orders.length : store.state.orders.filter(o => o.status === t).length})</span>}
            </button>
          ))}
        </div>
        <Card padded={false}>
          <OrderTable orders={filtered} store={store}/>
        </Card>
      </div>
    </div>
  );
};

// ── Cash Flow ────────────────────────────────────────────────────
const CashPage = ({ store }) => {
  const [adding, setAdding] = React.useState(false);
  const [newEntry, setNewEntry] = React.useState({ type: "in", cat: "Vendas", desc: "", amount: 0 });

  const { cash, revenue } = store.state;
  const todayIn = cash.filter(c => c.when.startsWith("Hoje") && c.type === "in").reduce((n, c) => n + c.amount, 0);
  const todayOut = cash.filter(c => c.when.startsWith("Hoje") && c.type === "out").reduce((n, c) => n + c.amount, 0);
  const weekIn = cash.filter(c => c.type === "in").reduce((n, c) => n + c.amount, 0);
  const weekOut = cash.filter(c => c.type === "out").reduce((n, c) => n + c.amount, 0);

  // Category breakdown for ring
  const catTotals = {};
  cash.filter(c => c.type === "out").forEach(c => {
    catTotals[c.cat] = (catTotals[c.cat] || 0) + c.amount;
  });
  const totalOut = Object.values(catTotals).reduce((n, v) => n + v, 0);

  const handleAdd = () => {
    store.addCash({ ...newEntry, when: "Hoje agora" });
    setNewEntry({ type: "in", cat: "Vendas", desc: "", amount: 0 });
    setAdding(false);
  };

  return (
    <div className="view-fade">
      <AdminTopbar title="Controle de caixa"
                   subtitle="Entradas, saídas e fluxo do ateliê"
                   actions={<Button icon="plus" onClick={() => setAdding(true)}>Novo lançamento</Button>}/>
      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <Stat label="Saldo de hoje" value={brl(todayIn - todayOut)} delta={`${todayIn > todayOut ? "+" : ""}${brl(todayIn - todayOut)}`} deltaTone={todayIn > todayOut ? "accent" : "danger"}/>
          <Stat label="Entradas hoje" value={brl(todayIn)} icon="arrow_down"/>
          <Stat label="Saídas hoje" value={brl(todayOut)} icon="arrow_up"/>
          <Stat label="Líquido semana" value={brl(weekIn - weekOut)} caption={`${brl(weekIn)} in · ${brl(weekOut)} out`}/>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
              <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Faturamento</h3>
              <div className="muted" style={{ fontSize: 12 }}>Últimos 14 dias</div>
            </div>
            <RevenueChart data={revenue}/>
          </Card>

          <Card>
            <h3 className="serif" style={{ margin: "0 0 18px", fontSize: 22, fontWeight: 600 }}>Despesas por categoria</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <CategoryRing data={catTotals} total={totalOut}/>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(catTotals).map(([cat, amt], i) => (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: CAT_COLORS[i % CAT_COLORS.length] }}/>
                    <span className="soft" style={{ flex: 1 }}>{cat}</span>
                    <span style={{ fontWeight: 600 }}>{brl(amt)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card padded={false}>
          <div style={{
            padding: "16px 22px", display: "flex", justifyContent: "space-between",
            alignItems: "center", borderBottom: "1px solid var(--c-line-soft)",
          }}>
            <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Lançamentos</h3>
            <span className="muted" style={{ fontSize: 12 }}>{cash.length} registros</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--c-fg-muted)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px", fontWeight: 500 }}>Tipo</th>
                <th style={{ padding: "12px 16px", fontWeight: 500 }}>Categoria</th>
                <th style={{ padding: "12px 16px", fontWeight: 500 }}>Descrição</th>
                <th style={{ padding: "12px 16px", fontWeight: 500 }}>Quando</th>
                <th style={{ padding: "12px 16px", fontWeight: 500, textAlign: "right" }}>Valor</th>
                <th style={{ padding: "12px 16px", width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {cash.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid var(--c-line-soft)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 999,
                      background: c.type === "in" ? "var(--c-accent-soft)" : "var(--c-danger-soft)",
                      color: c.type === "in" ? "var(--c-accent)" : "var(--c-danger)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name={c.type === "in" ? "arrow_down" : "arrow_up"} size={14}/>
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}><Tag>{c.cat}</Tag></td>
                  <td style={{ padding: "12px 16px" }}>{c.desc}</td>
                  <td style={{ padding: "12px 16px" }} className="muted">{c.when}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: c.type === "in" ? "var(--c-accent)" : "var(--c-danger)" }}>
                    {c.type === "in" ? "+" : "−"} {brl(c.amount)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => store.deleteCash(c.id)} style={{ color: "var(--c-fg-muted)", padding: 4 }}>
                      <Icon name="trash" size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Novo lançamento"
             footer={
               <>
                 <Button variant="ghost" onClick={() => setAdding(false)}>Cancelar</Button>
                 <Button onClick={handleAdd} disabled={!newEntry.desc || !newEntry.amount}>Salvar lançamento</Button>
               </>
             }>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ v: "in", l: "Entrada", i: "arrow_down" }, { v: "out", l: "Saída", i: "arrow_up" }].map(opt => (
              <button key={opt.v} onClick={() => setNewEntry({ ...newEntry, type: opt.v })}
                      style={{
                        flex: 1, padding: 14,
                        border: `2px solid ${newEntry.type === opt.v ? "var(--c-primary)" : "var(--c-line-soft)"}`,
                        background: newEntry.type === opt.v ? "var(--c-primary-soft)" : "var(--c-surface)",
                        borderRadius: "var(--r-md)",
                        display: "flex", gap: 10, alignItems: "center", justifyContent: "center",
                      }}>
                <Icon name={opt.i} size={18}/>
                <span style={{ fontWeight: 500 }}>{opt.l}</span>
              </button>
            ))}
          </div>
          <Select label="Categoria" value={newEntry.cat} onChange={v => setNewEntry({ ...newEntry, cat: v })} options={CASH_CATS}/>
          <Input label="Descrição" placeholder="Ex: Pedido #2042 · Maria" value={newEntry.desc} onChange={e => setNewEntry({ ...newEntry, desc: e.target.value })}/>
          <Input label="Valor" prefix="R$" type="number" step="0.01" value={newEntry.amount} onChange={e => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })}/>
        </div>
      </Modal>
    </div>
  );
};

const CAT_COLORS = [
  "oklch(0.55 0.14 35)",
  "oklch(0.6 0.09 145)",
  "oklch(0.6 0.12 240)",
  "oklch(0.7 0.14 70)",
  "oklch(0.55 0.16 320)",
  "oklch(0.65 0.04 60)",
];

const CategoryRing = ({ data, total }) => {
  const entries = Object.entries(data);
  if (total === 0) return <div style={{ width: 140 }} className="muted">Sem dados</div>;
  const r = 50, cx = 60, cy = 60, C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="140" height="140" viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--c-line-soft)" strokeWidth="14"/>
      {entries.map(([cat, amt], i) => {
        const frac = amt / total;
        const dash = frac * C;
        const seg = (
          <circle key={cat} cx={cx} cy={cy} r={r} fill="none"
                  stroke={CAT_COLORS[i % CAT_COLORS.length]} strokeWidth="14"
                  strokeDasharray={`${dash} ${C - dash}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${cx} ${cy})`}/>
        );
        offset += dash;
        return seg;
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="9" fill="var(--c-fg-muted)"
            fontFamily="var(--font-mono)" letterSpacing="0.05em">TOTAL</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="13" fill="var(--c-fg)"
            fontFamily="var(--font-display)" fontWeight="600">{brlShort(total)}</text>
    </svg>
  );
};

// ── Price calculator ─────────────────────────────────────────────
const CalculatorPage = ({ store }) => {
  const [ingredients, setIngredients] = React.useState([
    { name: "Farinha de trigo", qty: 0.5, unit: "kg", cost: 6 },
    { name: "Manteiga sem sal", qty: 0.3, unit: "kg", cost: 48 },
    { name: "Ovos caipira", qty: 6, unit: "un", cost: 1.2 },
    { name: "Frango desfiado", qty: 0.8, unit: "kg", cost: 35 },
    { name: "Requeijão", qty: 0.2, unit: "kg", cost: 24 },
  ]);
  const [packaging, setPackaging] = React.useState(4.5);
  const [energy, setEnergy] = React.useState(3.8);
  const [hours, setHours] = React.useState(1.5);
  const [hourly, setHourly] = React.useState(25);
  const [margin, setMargin] = React.useState(120);
  const [marketplaceFee, setMarketplaceFee] = React.useState(0);
  const [yield_, setYield] = React.useState(1);

  const updateIng = (i, patch) => {
    setIngredients(ingredients.map((ing, idx) => idx === i ? { ...ing, ...patch } : ing));
  };
  const addIng = () => setIngredients([...ingredients, { name: "", qty: 1, unit: "kg", cost: 0 }]);
  const removeIng = i => setIngredients(ingredients.filter((_, idx) => idx !== i));

  const ingredientsCost = ingredients.reduce((n, ing) => n + ing.qty * ing.cost, 0);
  const labor = hours * hourly;
  const subtotal = ingredientsCost + packaging + energy + labor;
  const perUnit = subtotal / yield_;
  const beforeFees = perUnit * (1 + margin / 100);
  const final = beforeFees / (1 - marketplaceFee / 100);
  const profit = final - perUnit - (final * marketplaceFee / 100);

  return (
    <div className="view-fade">
      <AdminTopbar title="Calculadora de preço"
                   subtitle="Quanto cobrar para cada produto valer a pena"
                   actions={
                     <Button variant="ghost" icon="sparkle">Salvar como produto</Button>
                   }/>
      <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, alignItems: "start" }}>
        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Ingredientes</h3>
                <p className="muted" style={{ margin: "2px 0 0", fontSize: 12 }}>O que entra na receita</p>
              </div>
              <Button variant="ghost" size="sm" icon="plus" onClick={addIng}>Adicionar</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1.6fr 70px 60px 100px 100px 28px", gap: 8,
                fontSize: 11, color: "var(--c-fg-muted)", letterSpacing: "0.06em", textTransform: "uppercase",
                paddingBottom: 4,
              }}>
                <span>Item</span><span>Qtd</span><span>Un</span><span>R$/un</span><span style={{ textAlign: "right" }}>Subtotal</span><span/>
              </div>
              {ingredients.map((ing, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1.6fr 70px 60px 100px 100px 28px", gap: 8, alignItems: "center" }}>
                  <input value={ing.name} placeholder="Nome" onChange={e => updateIng(i, { name: e.target.value })}
                         style={{ padding: "8px 10px", background: "var(--c-surface-2)", border: "1px solid transparent", borderRadius: 6, fontSize: 13, outline: "none" }}/>
                  <input value={ing.qty} type="number" step="0.01" onChange={e => updateIng(i, { qty: parseFloat(e.target.value) || 0 })}
                         style={{ padding: "8px 10px", background: "var(--c-surface-2)", border: "1px solid transparent", borderRadius: 6, fontSize: 13, outline: "none" }}/>
                  <select value={ing.unit} onChange={e => updateIng(i, { unit: e.target.value })}
                         style={{ padding: "8px 6px", background: "var(--c-surface-2)", border: "1px solid transparent", borderRadius: 6, fontSize: 13, outline: "none" }}>
                    <option>kg</option><option>g</option><option>L</option><option>ml</option><option>un</option>
                  </select>
                  <input value={ing.cost} type="number" step="0.01" onChange={e => updateIng(i, { cost: parseFloat(e.target.value) || 0 })}
                         style={{ padding: "8px 10px", background: "var(--c-surface-2)", border: "1px solid transparent", borderRadius: 6, fontSize: 13, outline: "none" }}/>
                  <div style={{ textAlign: "right", fontSize: 13, fontWeight: 600 }}>{brl(ing.qty * ing.cost)}</div>
                  <button onClick={() => removeIng(i)} style={{ color: "var(--c-fg-muted)", padding: 4 }}>
                    <Icon name="close" size={14}/>
                  </button>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--c-line-soft)",
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
            }}>
              <span className="soft" style={{ fontSize: 13 }}>Total de ingredientes</span>
              <span className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{brl(ingredientsCost)}</span>
            </div>
          </Card>

          <Card>
            <h3 className="serif" style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 600 }}>Custos diretos</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Embalagem" prefix="R$" type="number" step="0.01" value={packaging}
                     onChange={e => setPackaging(parseFloat(e.target.value) || 0)}/>
              <Input label="Gás / energia" prefix="R$" type="number" step="0.01" value={energy}
                     onChange={e => setEnergy(parseFloat(e.target.value) || 0)}/>
              <Input label="Horas de preparo" type="number" step="0.5" suffix="h" value={hours}
                     onChange={e => setHours(parseFloat(e.target.value) || 0)}/>
              <Input label="Valor da hora" prefix="R$" type="number" step="0.5" value={hourly}
                     onChange={e => setHourly(parseFloat(e.target.value) || 0)}/>
            </div>
            <div style={{
              marginTop: 14, padding: 12, background: "var(--c-surface-2)", borderRadius: "var(--r-sm)",
              display: "flex", justifyContent: "space-between", fontSize: 13,
            }}>
              <span className="soft">Mão de obra ({hours}h × {brl(hourly)})</span>
              <span style={{ fontWeight: 600 }}>{brl(labor)}</span>
            </div>
          </Card>

          <Card>
            <h3 className="serif" style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 600 }}>Margem e taxas</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <Input label="Margem de lucro" suffix="%" type="number" value={margin}
                     onChange={e => setMargin(parseFloat(e.target.value) || 0)}
                     hint="sobre o custo unitário"/>
              <Input label="Taxa marketplace" suffix="%" type="number" value={marketplaceFee}
                     onChange={e => setMarketplaceFee(parseFloat(e.target.value) || 0)}
                     hint="iFood, Uber, etc."/>
              <Input label="Rendimento" suffix="un" type="number" value={yield_}
                     onChange={e => setYield(parseFloat(e.target.value) || 1)}
                     hint="quantas unidades rende"/>
            </div>
          </Card>
        </div>

        {/* Result panel */}
        <div style={{ position: "sticky", top: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ background: "linear-gradient(165deg, var(--c-primary), var(--c-primary-2))", color: "#fff", border: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.8 }}>Preço sugerido</div>
            <div className="serif" style={{ fontSize: 64, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 8 }}>{brl(final)}</div>
            <div style={{ opacity: 0.85, fontSize: 13, marginTop: 8 }}>por unidade · {yield_ > 1 ? `${yield_} un da receita` : "1 unidade"}</div>
            <div style={{
              marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.2)",
              display: "flex", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em" }}>Lucro líquido</div>
                <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{brl(profit)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em" }}>Margem real</div>
                <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{((profit / final) * 100).toFixed(1)}%</div>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="serif" style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 600 }}>Como chegamos lá</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <CalcRow label="Ingredientes" value={ingredientsCost}/>
              <CalcRow label="Embalagem" value={packaging}/>
              <CalcRow label="Gás / energia" value={energy}/>
              <CalcRow label="Mão de obra" value={labor}/>
              <div style={{ height: 1, background: "var(--c-line-soft)" }}/>
              <CalcRow label="Custo total" value={subtotal} bold/>
              <CalcRow label={`Por unidade (÷ ${yield_})`} value={perUnit} bold/>
              <div style={{ height: 1, background: "var(--c-line-soft)" }}/>
              <CalcRow label={`+ Margem ${margin}%`} value={beforeFees - perUnit} muted/>
              <CalcRow label="Preço antes da taxa" value={beforeFees}/>
              <CalcRow label={`+ Taxa ${marketplaceFee}%`} value={final - beforeFees} muted/>
              <div style={{ height: 1, background: "var(--c-line-soft)" }}/>
              <CalcRow label="Preço final" value={final} bold large/>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CalcRow = ({ label, value, bold, muted, large }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
    <span style={{ color: muted ? "var(--c-fg-muted)" : "var(--c-fg-soft)" }}>{label}</span>
    <span style={{
      fontWeight: bold ? 700 : 500,
      fontSize: large ? 22 : 13,
      fontFamily: large ? "var(--font-display)" : "inherit",
    }}>{brl(value)}</span>
  </div>
);

// ── Admin shell ──────────────────────────────────────────────────
const AdminApp = ({ store, view, setView, t }) => {
  const [page, setPage] = React.useState(view.page || "dashboard");
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar page={page} setPage={setPage} setView={setView}/>
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {page === "dashboard"  && <DashboardPage store={store} setPage={setPage} t={t}/>}
        {page === "products"   && <ProductsPage store={store}/>}
        {page === "orders"     && <OrdersPage store={store}/>}
        {page === "cash"       && <CashPage store={store}/>}
        {page === "calculator" && <CalculatorPage store={store}/>}
      </main>
    </div>
  );
};

Object.assign(window, {
  AdminApp, AdminSidebar, AdminTopbar,
  DashboardPage, ProductsPage, OrdersPage, CashPage, CalculatorPage,
  RevenueChart, CategoryRing, OrderTable,
});
