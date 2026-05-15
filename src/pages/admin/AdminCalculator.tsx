import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { brl } from "../../lib/utils";

interface Ingredient {
  id: string;
  name: string;
  qty: number;
  unit: string;
  costPerUnit: number;
}

export function AdminCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "Farinha de trigo", qty: 500, unit: "g", costPerUnit: 0.006 },
    { id: "2", name: "Ovos", qty: 4, unit: "un", costPerUnit: 1.2 },
    { id: "3", name: "Manteiga", qty: 200, unit: "g", costPerUnit: 0.05 },
    { id: "4", name: "Açúcar", qty: 300, unit: "g", costPerUnit: 0.004 },
    { id: "5", name: "Chocolate em pó", qty: 100, unit: "g", costPerUnit: 0.08 },
  ]);
  const [packaging, setPackaging] = useState(1500);
  const [energy, setEnergy] = useState(800);
  const [hours, setHours] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(3000);
  const [margin, setMargin] = useState(60);
  const [marketplaceFee, setMarketplaceFee] = useState(0);
  const [yieldUnits, setYieldUnits] = useState(1);

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", qty: 100, unit: "g", costPerUnit: 0 },
    ]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const calc = useMemo(() => {
    const ingredientsTotal = ingredients.reduce((acc, i) => acc + i.qty * i.costPerUnit, 0);
    const laborCost = hours * (hourlyRate / 100);
    const subtotalCents = ingredientsTotal * 100 + packaging + energy + Math.round(laborCost * 100);
    const perUnit = subtotalCents / Math.max(yieldUnits, 1);
    const beforeFees = perUnit * (1 + margin / 100);
    const finalPrice = marketplaceFee > 0 ? beforeFees / (1 - marketplaceFee / 100) : beforeFees;
    const feeAmount = finalPrice * (marketplaceFee / 100);
    const profit = finalPrice - perUnit - feeAmount;
    const marginReal = finalPrice > 0 ? (profit / finalPrice) * 100 : 0;
    return {
      ingredientsTotal: Math.round(ingredientsTotal * 100),
      laborCost: Math.round(laborCost * 100),
      subtotalCents: Math.round(subtotalCents),
      perUnit: Math.round(perUnit),
      finalPrice: Math.round(finalPrice),
      profit: Math.round(profit),
      marginReal: Math.round(marginReal * 10) / 10,
    };
  }, [ingredients, packaging, energy, hours, hourlyRate, margin, marketplaceFee, yieldUnits]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
        Calculadora de preço
      </h1>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-start">
        {/* Esquerda — inputs */}
        <div className="flex flex-col gap-5">
          {/* Ingredientes */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold" style={{ color: "oklch(var(--c-fg))" }}>Ingredientes</p>
              <Button variant="soft" size="sm" onClick={addIngredient}>
                <Plus size={12} /> Adicionar
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {["Nome", "Qtd", "Un.", "R$/un", "Total", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold pb-2" style={{ color: "oklch(var(--c-fg-muted))" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ing) => (
                    <tr key={ing.id}>
                      <td className="pr-2 pb-2">
                        <input
                          value={ing.name}
                          onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                          placeholder="Ingrediente"
                          className="w-full rounded-lg border px-2 py-1 text-xs outline-none"
                          style={{ borderColor: "oklch(var(--c-line))", background: "oklch(var(--c-surface))", color: "oklch(var(--c-fg))" }}
                        />
                      </td>
                      <td className="pr-2 pb-2 w-16">
                        <input
                          type="number"
                          value={ing.qty}
                          onChange={(e) => updateIngredient(ing.id, "qty", Number(e.target.value))}
                          className="w-full rounded-lg border px-2 py-1 text-xs text-right outline-none"
                          style={{ borderColor: "oklch(var(--c-line))", background: "oklch(var(--c-surface))", color: "oklch(var(--c-fg))" }}
                        />
                      </td>
                      <td className="pr-2 pb-2 w-14">
                        <input
                          value={ing.unit}
                          onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                          className="w-full rounded-lg border px-2 py-1 text-xs outline-none"
                          style={{ borderColor: "oklch(var(--c-line))", background: "oklch(var(--c-surface))", color: "oklch(var(--c-fg))" }}
                        />
                      </td>
                      <td className="pr-2 pb-2 w-20">
                        <input
                          type="number"
                          step="0.01"
                          value={ing.costPerUnit}
                          onChange={(e) => updateIngredient(ing.id, "costPerUnit", Number(e.target.value))}
                          className="w-full rounded-lg border px-2 py-1 text-xs text-right outline-none"
                          style={{ borderColor: "oklch(var(--c-line))", background: "oklch(var(--c-surface))", color: "oklch(var(--c-fg))" }}
                        />
                      </td>
                      <td className="pr-2 pb-2 text-xs text-right font-medium" style={{ color: "oklch(var(--c-fg))" }}>
                        {brl(Math.round(ing.qty * ing.costPerUnit * 100))}
                      </td>
                      <td className="pb-2">
                        <button
                          onClick={() => removeIngredient(ing.id)}
                          className="p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} style={{ color: "oklch(var(--c-danger))" }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t" style={{ borderColor: "oklch(var(--c-line-soft))" }}>
                    <td colSpan={4} className="pt-2 text-xs font-semibold" style={{ color: "oklch(var(--c-fg-soft))" }}>
                      Total ingredientes
                    </td>
                    <td className="pt-2 text-sm font-semibold text-right" style={{ color: "oklch(var(--c-fg))" }}>
                      {brl(calc.ingredientsTotal)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Custos diretos */}
          <Card className="p-5">
            <p className="font-semibold mb-4" style={{ color: "oklch(var(--c-fg))" }}>Custos diretos</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Embalagem (R$)", value: packaging, setter: setPackaging },
                { label: "Gás/Energia (R$)", value: energy, setter: setEnergy },
                { label: "Horas de trabalho", value: hours, setter: setHours },
                { label: "Valor/hora (R$)", value: hourlyRate, setter: setHourlyRate },
              ].map(({ label, value, setter }) => (
                <div key={label} className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "oklch(var(--c-fg-soft))" }}>{label}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="rounded-xl border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "oklch(var(--c-line))", background: "oklch(var(--c-surface))", color: "oklch(var(--c-fg))" }}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "oklch(var(--c-fg-muted))" }}>
              Mão de obra calculada: {brl(calc.laborCost)}
            </p>
          </Card>

          {/* Margem e taxas */}
          <Card className="p-5">
            <p className="font-semibold mb-4" style={{ color: "oklch(var(--c-fg))" }}>Margem e taxas</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Margem (%)", value: margin, setter: setMargin },
                { label: "Taxa marketplace (%)", value: marketplaceFee, setter: setMarketplaceFee },
                { label: "Rendimento (un)", value: yieldUnits, setter: setYieldUnits },
              ].map(({ label, value, setter }) => (
                <div key={label} className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "oklch(var(--c-fg-soft))" }}>{label}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="rounded-xl border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "oklch(var(--c-line))", background: "oklch(var(--c-surface))", color: "oklch(var(--c-fg))" }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Direita — resultados */}
        <div className="flex flex-col gap-4 md:sticky md:top-8">
          {/* Resultado principal */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "oklch(var(--c-primary))" }}
          >
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">
              Preço sugerido
            </p>
            <p className="font-display font-semibold text-white" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
              {brl(calc.finalPrice)}
            </p>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Lucro líquido</p>
                <p className="font-semibold text-white text-lg font-display">{brl(calc.profit)}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Margem real</p>
                <p className="font-semibold text-white text-lg font-display">{calc.marginReal}%</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <Card className="p-5">
            <p className="font-semibold mb-4 text-sm" style={{ color: "oklch(var(--c-fg))" }}>
              Como chegamos lá
            </p>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { label: "Ingredientes",       value: calc.ingredientsTotal },
                { label: "Embalagem",          value: packaging },
                { label: "Gás/Energia",        value: energy },
                { label: "Mão de obra",        value: calc.laborCost },
                { label: "Subtotal",           value: calc.subtotalCents, bold: true },
                { label: "Custo por unidade",  value: calc.perUnit },
                { label: `Margem aplicada (${margin}%)`, value: calc.finalPrice - calc.perUnit },
                ...(marketplaceFee > 0 ? [{ label: `Taxa marketplace (${marketplaceFee}%)`, value: -(Math.round(calc.finalPrice * marketplaceFee / 100)) }] : []),
              ].map(({ label, value, bold }) => (
                <div
                  key={label}
                  className={`flex justify-between ${bold ? "border-t pt-2 font-semibold" : ""}`}
                  style={{ borderColor: "oklch(var(--c-line-soft))", color: bold ? "oklch(var(--c-fg))" : "oklch(var(--c-fg-soft))" }}
                >
                  <span>{label}</span>
                  <span style={{ color: value < 0 ? "oklch(var(--c-danger))" : undefined }}>
                    {value < 0 ? "−" : ""}{brl(Math.abs(value))}
                  </span>
                </div>
              ))}
              <div
                className="flex justify-between font-semibold pt-2 border-t text-base"
                style={{ borderColor: "oklch(var(--c-line-soft))", color: "oklch(var(--c-primary))" }}
              >
                <span>Preço final</span>
                <span>{brl(calc.finalPrice)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
