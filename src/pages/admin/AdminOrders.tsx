import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Order, OrderStatus } from "../../domain/types";
import { Card } from "../../components/ui/Card";
import { Tag } from "../../components/ui/Tag";
import { brl } from "../../lib/utils";

const STATUSES: { value: OrderStatus | "todos"; label: string }[] = [
  { value: "todos",           label: "Todos" },
  { value: "em_producao",     label: "Em produção" },
  { value: "saiu_entrega",    label: "Saiu p/ entrega" },
  { value: "pronto_retirada", label: "Pronto p/ retirada" },
  { value: "entregue",        label: "Entregue" },
  { value: "cancelado",       label: "Cancelado" },
];

const STATUS_TAG: Record<OrderStatus, { label: string; tone: "primary" | "accent" | "danger" | "warn" | "neutral" }> = {
  em_producao:     { label: "Em produção",        tone: "primary" },
  saiu_entrega:    { label: "Saiu p/ entrega",    tone: "warn" },
  pronto_retirada: { label: "Pronto p/ retirada", tone: "accent" },
  entregue:        { label: "Entregue",            tone: "accent" },
  cancelado:       { label: "Cancelado",           tone: "danger" },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  em_producao:     "saiu_entrega",
  saiu_entrega:    "entregue",
  pronto_retirada: "entregue",
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | "todos">("todos");

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data } = await supabase
      .from("ayumi_orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }

  async function advanceStatus(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await supabase.from("ayumi_orders").update({ status: next }).eq("id", order.id);
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: next } : o));
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.value] = s.value === "todos"
      ? orders.length
      : orders.filter((o) => o.status === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = activeTab === "todos" ? orders : orders.filter((o) => o.status === activeTab);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
        Pedidos
      </h1>

      {/* Tabs de status */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setActiveTab(s.value as OrderStatus | "todos")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={
              activeTab === s.value
                ? { background: "oklch(var(--c-fg))", color: "oklch(var(--c-bg))" }
                : { background: "oklch(var(--c-surface))", color: "oklch(var(--c-fg-soft))", border: "1px solid oklch(var(--c-line))" }
            }
          >
            {s.label}
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={
                activeTab === s.value
                  ? { background: "rgba(255,255,255,0.2)", color: "inherit" }
                  : { background: "oklch(var(--c-surface-2))", color: "oklch(var(--c-fg-muted))" }
              }
            >
              {counts[s.value]}
            </span>
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-left"
                style={{ borderColor: "oklch(var(--c-line-soft))" }}
              >
                {["ID", "Cliente", "Bairro/Método", "Itens", "Total", "Status", "Quando", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "oklch(var(--c-fg-muted))" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: "oklch(var(--c-fg-muted))" }}>
                    Carregando...
                  </td>
                </tr>
              ) : filtered.map((o) => {
                const st = STATUS_TAG[o.status];
                const items = Array.isArray(o.items) ? o.items : [];
                const itemCount = items.reduce((a: number, i: any) => a + (i.qty ?? 1), 0);
                return (
                  <tr
                    key={o.id}
                    className="border-b hover:bg-[oklch(var(--c-surface-2)/0.5)] transition-colors"
                    style={{ borderColor: "oklch(var(--c-line-soft))" }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "oklch(var(--c-primary))" }}>
                      {o.order_number}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: "oklch(var(--c-fg))" }}>{o.customer_name}</p>
                      <p className="text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>{o.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3" style={{ color: "oklch(var(--c-fg-soft))" }}>
                      {o.delivery_method === "entrega" ? o.bairro : "Retirada"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "oklch(var(--c-fg-soft))" }}>
                      {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
                      {brl(o.total_cents)}
                    </td>
                    <td className="px-4 py-3">
                      <Tag tone={st.tone}>{st.label}</Tag>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>
                      {new Date(o.created_at).toLocaleString("pt-BR", {
                        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {NEXT_STATUS[o.status] && (
                        <button
                          onClick={() => advanceStatus(o)}
                          className="text-xs px-2 py-1 rounded-lg font-medium transition-colors hover:opacity-80"
                          style={{ background: "oklch(var(--c-primary-soft))", color: "oklch(var(--c-primary))" }}
                        >
                          Avançar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-sm" style={{ color: "oklch(var(--c-fg-muted))" }}>
              Nenhum pedido neste status.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
