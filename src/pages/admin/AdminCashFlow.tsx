import { useEffect, useState } from "react";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import type { CashEntry } from "../../domain/types";
import { Stat } from "../../components/ui/Stat";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input, Select } from "../../components/ui/Input";
import { brl, brlShort } from "../../lib/utils";

const CATEGORIES = ["Vendas", "Ingredientes", "Embalagens", "Combustível", "Marketing", "Outros"];

const schema = z.object({
  type: z.enum(["in", "out"]),
  category: z.string().min(1),
  description: z.string().min(1),
  amount_cents: z.coerce.number().min(1, "Valor obrigatório"),
});
type FormData = z.infer<typeof schema>;

const SEED_REVENUE = [240, 310, 285, 410, 360, 520, 480, 390, 445, 520, 615, 540, 670, 712];

function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const w = 400; const h = 80;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - 4 - ((v / max) * (h - 12)),
  }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${pts.at(-1)!.x} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.22 350)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 350)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cashGrad)" />
      <path d={path} fill="none" stroke="oklch(0.62 0.22 350)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ExpenseRing({ entries }: { entries: CashEntry[] }) {
  const out = entries.filter((e) => e.type === "out");
  const totals = CATEGORIES.slice(1).reduce((acc, cat) => {
    acc[cat] = out.filter((e) => e.category === cat).reduce((s, e) => s + e.amount_cents, 0);
    return acc;
  }, {} as Record<string, number>);
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  if (total === 0) return <p className="text-sm text-center py-4" style={{ color: "oklch(var(--c-fg-muted))" }}>Sem despesas.</p>;

  const colors = ["oklch(0.62 0.22 350)", "oklch(0.7 0.14 200)", "oklch(0.7 0.14 70)", "oklch(0.55 0.18 25)", "oklch(0.6 0.18 280)"];
  const r = 40; const cx = 60; const cy = 60;
  let cumAngle = -Math.PI / 2;
  const slices = Object.entries(totals)
    .filter(([, v]) => v > 0)
    .map(([cat, val], i) => {
      const frac = val / total;
      const angle = frac * Math.PI * 2;
      const x1 = cx + r * Math.cos(cumAngle);
      const y1 = cy + r * Math.sin(cumAngle);
      cumAngle += angle;
      const x2 = cx + r * Math.cos(cumAngle);
      const y2 = cy + r * Math.sin(cumAngle);
      const large = angle > Math.PI ? 1 : 0;
      return { cat, val, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: colors[i % colors.length] };
    });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-28 h-28 shrink-0">
        {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} />)}
        <circle cx={cx} cy={cy} r={24} fill="oklch(var(--c-surface))" />
      </svg>
      <div className="flex flex-col gap-1.5">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span style={{ color: "oklch(var(--c-fg-soft))" }}>{s.cat}</span>
            <span className="font-semibold ml-auto" style={{ color: "oklch(var(--c-fg))" }}>{brl(s.val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminCashFlow() {
  const [entries, setEntries] = useState<CashEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<"in" | "out">("in");
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "in" },
  });

  useEffect(() => { fetchEntries(); }, []);

  async function fetchEntries() {
    const { data } = await supabase
      .from("cash_entries")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries(data ?? []);
    setLoading(false);
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    await supabase.from("cash_entries").insert({
      type: data.type,
      category: data.category,
      description: data.description,
      amount_cents: data.amount_cents,
    });
    setModalOpen(false);
    reset();
    setSaving(false);
    fetchEntries();
  };

  const today = new Date().toDateString();
  const week = new Date(); week.setDate(week.getDate() - 7);
  const todayIn  = entries.filter((e) => new Date(e.created_at).toDateString() === today && e.type === "in").reduce((a, e) => a + e.amount_cents, 0);
  const todayOut = entries.filter((e) => new Date(e.created_at).toDateString() === today && e.type === "out").reduce((a, e) => a + e.amount_cents, 0);
  const weekNet  = entries.filter((e) => new Date(e.created_at) >= week).reduce((a, e) => a + (e.type === "in" ? e.amount_cents : -e.amount_cents), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
          Controle de caixa
        </h1>
        <Button variant="primary" onClick={() => { reset({ type: "in" }); setEntryType("in"); setModalOpen(true); }}>
          <Plus size={16} />
          Novo lançamento
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Saldo hoje" value={brl(todayIn - todayOut)} deltaPositive={todayIn > todayOut} />
        <Stat label="Entradas hoje" value={brl(todayIn)} icon={<TrendingUp size={16} />} deltaPositive />
        <Stat label="Saídas hoje" value={brl(todayOut)} icon={<TrendingDown size={16} />} />
        <Stat label="Líquido semana" value={brlShort(weekNet)} deltaPositive={weekNet > 0} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-[1.6fr_1fr] gap-6">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "oklch(var(--c-fg-muted))" }}>
            Faturamento — 14 dias
          </p>
          <MiniChart data={SEED_REVENUE} />
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "oklch(var(--c-fg-muted))" }}>
            Despesas por categoria
          </p>
          <ExpenseRing entries={entries} />
        </Card>
      </div>

      {/* Tabela de lançamentos */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: "oklch(var(--c-line-soft))" }}>
          <p className="font-semibold" style={{ color: "oklch(var(--c-fg))" }}>Lançamentos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "oklch(var(--c-line-soft))" }}>
                {["Tipo", "Categoria", "Descrição", "Quando", "Valor"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(var(--c-fg-muted))" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: "oklch(var(--c-fg-muted))" }}>Carregando...</td></tr>
              ) : entries.map((e) => (
                <tr key={e.id} className="border-b hover:bg-[oklch(var(--c-surface-2)/0.4)] transition-colors" style={{ borderColor: "oklch(var(--c-line-soft))" }}>
                  <td className="px-4 py-3">
                    {e.type === "in"
                      ? <TrendingUp size={14} style={{ color: "oklch(var(--c-accent))" }} />
                      : <TrendingDown size={14} style={{ color: "oklch(var(--c-danger))" }} />
                    }
                  </td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: "oklch(var(--c-fg-soft))" }}>{e.category}</td>
                  <td className="px-4 py-3" style={{ color: "oklch(var(--c-fg))" }}>{e.description}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>
                    {new Date(e.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: e.type === "in" ? "oklch(var(--c-accent))" : "oklch(var(--c-danger))" }}>
                    {e.type === "in" ? "+" : "−"}{brl(e.amount_cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && entries.length === 0 && (
            <div className="px-4 py-10 text-center text-sm" style={{ color: "oklch(var(--c-fg-muted))" }}>
              Nenhum lançamento ainda.
            </div>
          )}
        </div>
      </Card>

      {/* Modal novo lançamento */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo lançamento"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" loading={saving} onClick={handleSubmit(onSubmit)}>Salvar</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {(["in", "out"] as const).map((t) => (
              <label
                key={t}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: entryType === t ? "oklch(var(--c-primary))" : "oklch(var(--c-line))",
                  background: entryType === t ? "oklch(var(--c-primary-soft))" : "oklch(var(--c-surface))",
                }}
              >
                <input
                  type="radio"
                  value={t}
                  {...register("type")}
                  className="sr-only"
                  onChange={() => { setEntryType(t); setValue("type", t); }}
                />
                <span className="text-sm font-medium" style={{ color: "oklch(var(--c-fg))" }}>
                  {t === "in" ? "Entrada" : "Saída"}
                </span>
              </label>
            ))}
          </div>
          <Select
            label="Categoria"
            error={errors.category?.message}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            {...register("category")}
          />
          <Input label="Descrição" error={errors.description?.message} {...register("description")} />
          <Input
            label="Valor (centavos)"
            type="number"
            hint="R$ 89,00 → 8900"
            error={errors.amount_cents?.message}
            {...register("amount_cents")}
          />
        </div>
      </Modal>
    </div>
  );
}
