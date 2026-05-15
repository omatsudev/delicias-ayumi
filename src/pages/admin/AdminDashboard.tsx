import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, TrendingUp, Tag } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Order, CashEntry, Product } from "../../domain/types";
import { Stat } from "../../components/ui/Stat";
import { Card } from "../../components/ui/Card";
import { brl, brlShort } from "../../lib/utils";

const ORDER_STATUS_LABEL: Record<string, string> = {
  em_producao: "Em produção",
  saiu_entrega: "Saiu p/ entrega",
  pronto_retirada: "Pronto p/ retirada",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const SEED_REVENUE = [240, 310, 285, 410, 360, 520, 480, 390, 445, 520, 615, 540, 670, 712];

function RevenueChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const w = 400;
  const h = 100;
  const padX = 8;
  const points = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (w - padX * 2),
    y: h - 8 - ((v / max) * (h - 20)),
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${points.at(-1)!.x} ${h} L ${points[0].x} ${h} Z`;
  const last = points.at(-1)!;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.22 350)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 350)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#revenueGrad)" />
      <path d={path} fill="none" stroke="oklch(0.62 0.22 350)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="4" fill="oklch(0.62 0.22 350)" />
    </svg>
  );
}

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cashEntries, setCashEntries] = useState<CashEntry[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("cash_entries").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("products").select("*").eq("active", true).limit(4),
    ]).then(([ordersRes, cashRes, productsRes]) => {
      setOrders(ordersRes.data ?? []);
      setCashEntries(cashRes.data ?? []);
      setTopProducts(productsRes.data ?? []);
      setLoading(false);
    });
  }, []);

  const today = new Date().toDateString();
  const todayEntries = cashEntries.filter((e) => new Date(e.created_at).toDateString() === today);
  const todaySaldo = todayEntries.reduce(
    (acc, e) => acc + (e.type === "in" ? e.amount_cents : -e.amount_cents),
    0
  );
  const activeOrders = orders.filter(
    (o) => !["entregue", "cancelado"].includes(o.status)
  ).length;
  const revenue14d = cashEntries
    .filter((e) => e.type === "in")
    .reduce((acc, e) => acc + e.amount_cents, 0);
  const avgTicket = orders.length > 0
    ? Math.round(orders.reduce((a, o) => a + o.total_cents, 0) / orders.length)
    : 0;

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl" style={{ background: "oklch(var(--c-surface-2))" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
        Visão geral
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat
          label="Saldo de hoje"
          value={brl(todaySaldo)}
          icon={<DollarSign size={18} />}
          deltaPositive={todaySaldo > 0}
        />
        <Stat
          label="Pedidos ativos"
          value={String(activeOrders)}
          icon={<ShoppingBag size={18} />}
        />
        <Stat
          label="Faturamento 14d"
          value={brlShort(revenue14d)}
          icon={<TrendingUp size={18} />}
          deltaPositive
        />
        <Stat
          label="Ticket médio"
          value={brl(avgTicket)}
          icon={<Tag size={18} />}
        />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-6">
        {/* Revenue chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(var(--c-fg-muted))" }}>
                Faturamento
              </p>
              <p className="font-display text-2xl font-semibold mt-0.5" style={{ color: "oklch(var(--c-fg))" }}>
                Últimos 14 dias
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "oklch(var(--c-primary-soft))", color: "oklch(var(--c-primary))" }}>
              +12% vs. período anterior
            </span>
          </div>
          <RevenueChart data={SEED_REVENUE} />
        </Card>

        {/* Top produtos */}
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "oklch(var(--c-fg-muted))" }}>
            Mais vendidos
          </p>
          <div className="flex flex-col gap-3">
            {topProducts.slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: "oklch(var(--c-primary))" }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "oklch(var(--c-fg))" }}>
                    {p.name}
                  </p>
                  <p className="text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>
                    {p.category}
                  </p>
                </div>
                <span className="text-sm font-semibold shrink-0" style={{ color: "oklch(var(--c-fg))" }}>
                  {brl(p.price_cents)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pedidos recentes */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold" style={{ color: "oklch(var(--c-fg))" }}>Pedidos recentes</p>
          <Link
            to="/admin/pedidos"
            className="text-sm font-medium hover:underline"
            style={{ color: "oklch(var(--c-primary))" }}
          >
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "oklch(var(--c-fg-muted))" }}>
                {["Pedido", "Cliente", "Bairro", "Total", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide pb-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr
                  key={o.id}
                  className="border-t"
                  style={{ borderColor: "oklch(var(--c-line-soft))" }}
                >
                  <td className="py-2.5 font-medium" style={{ color: "oklch(var(--c-primary))" }}>
                    {o.order_number}
                  </td>
                  <td className="py-2.5" style={{ color: "oklch(var(--c-fg))" }}>
                    {o.customer_name}
                  </td>
                  <td className="py-2.5" style={{ color: "oklch(var(--c-fg-soft))" }}>
                    {o.bairro ?? "Retirada"}
                  </td>
                  <td className="py-2.5 font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
                    {brl(o.total_cents)}
                  </td>
                  <td className="py-2.5">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        background:
                          o.status === "entregue"
                            ? "oklch(var(--c-accent-soft))"
                            : o.status === "cancelado"
                            ? "oklch(0.97 0.02 25)"
                            : "oklch(var(--c-primary-soft))",
                        color:
                          o.status === "entregue"
                            ? "oklch(var(--c-accent))"
                            : o.status === "cancelado"
                            ? "oklch(var(--c-danger))"
                            : "oklch(var(--c-primary))",
                      }}
                    >
                      {ORDER_STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: "oklch(var(--c-fg-muted))" }}>
              Nenhum pedido ainda.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
