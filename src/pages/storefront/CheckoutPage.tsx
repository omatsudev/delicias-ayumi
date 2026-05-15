import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import type { Neighborhood } from "../../domain/types";
import { useCartStore } from "../../store/cart";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input, Textarea, Select } from "../../components/ui/Input";
import { brl, isValidPetropolisCep, pixDiscount, formatPhone, formatCep } from "../../lib/utils";

const schema = z.object({
  customerName: z.string().min(3, "Nome obrigatório"),
  customerPhone: z.string().min(14, "Telefone inválido"),
  deliveryMethod: z.enum(["entrega", "retirada"]),
  cep: z.string().optional(),
  bairro: z.string().optional(),
  address: z.string().optional(),
  paymentMethod: z.enum(["pix", "cartao", "dinheiro"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

let orderSeq = 2042;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryMethod: "entrega",
      paymentMethod: "pix",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  const paymentMethod = watch("paymentMethod");
  const bairroValue = watch("bairro");
  const cepValue = watch("cep") ?? "";

  useEffect(() => {
    supabase
      .from("neighborhoods")
      .select("*")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setNeighborhoods(data ?? []));
  }, []);

  useEffect(() => {
    if (cepValue.replace(/\D/g, "").length === 8) {
      if (!isValidPetropolisCep(cepValue)) {
        setCepError("CEP fora da área de entrega (Petrópolis/RJ: 25600–25960)");
      } else {
        setCepError("");
      }
    } else {
      setCepError("");
    }
  }, [cepValue]);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="font-display text-2xl mb-4" style={{ color: "oklch(var(--c-fg))" }}>
          Sua sacola está vazia
        </p>
        <Link to="/"><Button variant="primary">Ver cardápio</Button></Link>
      </div>
    );
  }

  const selectedNeighborhood = neighborhoods.find((n) => n.name === bairroValue);
  const fee = deliveryMethod === "entrega" && selectedNeighborhood ? selectedNeighborhood.fee_cents : 0;
  const sub = subtotal();
  const discount = paymentMethod === "pix" ? pixDiscount(sub + fee) : 0;
  const total = sub + fee - discount;

  const onSubmit = async (data: FormData) => {
    if (deliveryMethod === "entrega" && cepError) return;
    setLoading(true);
    try {
      const orderNumber = `#${orderSeq++}`;
      const itemsSnapshot = items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        qty: i.qty,
        unit_price_cents: i.product.price_cents,
      }));

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: data.customerName,
          customer_phone: data.customerPhone,
          delivery_method: data.deliveryMethod,
          bairro: data.deliveryMethod === "entrega" ? data.bairro ?? null : null,
          address: data.deliveryMethod === "entrega" ? data.address ?? null : null,
          cep: data.deliveryMethod === "entrega" ? data.cep ?? null : null,
          payment_method: data.paymentMethod,
          subtotal_cents: sub,
          fee_cents: fee,
          total_cents: total,
          notes: data.notes ?? null,
          items: itemsSnapshot,
        })
        .select()
        .single();

      if (error) throw error;

      clearCart();
      navigate(`/pedido/${order.id}/confirmado`);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
      <Link
        to="/carrinho"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
        style={{ color: "oklch(var(--c-fg-soft))" }}
      >
        <ArrowLeft size={16} />
        Voltar à sacola
      </Link>

      <h1 className="font-display text-4xl font-semibold mb-8" style={{ color: "oklch(var(--c-fg))" }}>
        Finalizar pedido
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 items-start">
          {/* Formulário */}
          <div className="flex flex-col gap-5">
            {/* Dados pessoais */}
            <Card className="p-5">
              <h2 className="font-semibold mb-4" style={{ color: "oklch(var(--c-fg))" }}>
                Seus dados
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Nome completo"
                  placeholder="Maria da Silva"
                  error={errors.customerName?.message}
                  {...register("customerName")}
                />
                <Input
                  label="WhatsApp"
                  placeholder="(24) 98888-0000"
                  error={errors.customerPhone?.message}
                  {...register("customerPhone", {
                    onChange: (e) => setValue("customerPhone", formatPhone(e.target.value)),
                  })}
                />
              </div>
            </Card>

            {/* Entrega */}
            <Card className="p-5">
              <h2 className="font-semibold mb-4" style={{ color: "oklch(var(--c-fg))" }}>
                Entrega ou retirada
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {(["entrega", "retirada"] as const).map((method) => (
                  <label
                    key={method}
                    className="flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all"
                    style={{
                      borderColor: deliveryMethod === method
                        ? "oklch(var(--c-primary))"
                        : "oklch(var(--c-line))",
                      background: deliveryMethod === method
                        ? "oklch(var(--c-primary-soft))"
                        : "oklch(var(--c-surface))",
                    }}
                  >
                    <input
                      type="radio"
                      value={method}
                      {...register("deliveryMethod")}
                      className="sr-only"
                    />
                    <span className="font-medium text-sm capitalize" style={{ color: "oklch(var(--c-fg))" }}>
                      {method === "entrega" ? "Entrega" : "Retirada"}
                    </span>
                    <span className="text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>
                      {method === "entrega"
                        ? "Taxa por bairro"
                        : "Qua e Sáb, 14h–18h — Mosela"}
                    </span>
                  </label>
                ))}
              </div>

              {deliveryMethod === "entrega" ? (
                <div className="flex flex-col gap-4">
                  <Input
                    label="CEP"
                    placeholder="25600-000"
                    error={cepError || errors.cep?.message}
                    {...register("cep", {
                      onChange: (e) => setValue("cep", formatCep(e.target.value)),
                    })}
                  />
                  <Select
                    label="Bairro"
                    error={errors.bairro?.message}
                    options={[
                      { value: "", label: "Selecione o bairro..." },
                      ...neighborhoods.map((n) => ({
                        value: n.name,
                        label: `${n.name} — ${brl(n.fee_cents)}`,
                      })),
                    ]}
                    {...register("bairro")}
                  />
                  <Input
                    label="Endereço completo"
                    placeholder="Rua, número, complemento"
                    {...register("address")}
                  />
                </div>
              ) : (
                <div
                  className="rounded-xl p-4 text-sm"
                  style={{
                    background: "oklch(var(--c-surface-2))",
                    color: "oklch(var(--c-fg-soft))",
                  }}
                >
                  <p className="font-medium mb-1" style={{ color: "oklch(var(--c-fg))" }}>
                    Ateliê Delicias Ayumi
                  </p>
                  <p>Mosela, Petrópolis/RJ</p>
                  <p className="mt-1 text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>
                    Quartas e sábados, das 14h às 18h
                  </p>
                </div>
              )}
            </Card>

            {/* Pagamento */}
            <Card className="p-5">
              <h2 className="font-semibold mb-4" style={{ color: "oklch(var(--c-fg))" }}>
                Pagamento
              </h2>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {[
                  { value: "pix", label: "Pix", sub: "5% de desconto" },
                  { value: "cartao", label: "Cartão", sub: "Crédito / débito" },
                  { value: "dinheiro", label: "Dinheiro", sub: "Na entrega / retirada" },
                ].map((pm) => (
                  <label
                    key={pm.value}
                    className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all"
                    style={{
                      borderColor: paymentMethod === pm.value
                        ? "oklch(var(--c-primary))"
                        : "oklch(var(--c-line))",
                      background: paymentMethod === pm.value
                        ? "oklch(var(--c-primary-soft))"
                        : "oklch(var(--c-surface))",
                    }}
                  >
                    <input
                      type="radio"
                      value={pm.value}
                      {...register("paymentMethod")}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: "oklch(var(--c-fg))" }}>
                        {pm.label}
                      </p>
                      <p className="text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>
                        {pm.sub}
                      </p>
                    </div>
                    {paymentMethod === pm.value && (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "oklch(var(--c-primary))" }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
              <Textarea
                label="Observações (opcional)"
                placeholder="Alguma alergia, preferência de cobertura, mensagem no bolo..."
                rows={3}
                {...register("notes")}
              />
            </Card>
          </div>

          {/* Resumo do pedido (sticky) */}
          <div className="md:sticky md:top-24 flex flex-col gap-4">
            <Card className="p-5">
              <h2 className="font-semibold mb-4" style={{ color: "oklch(var(--c-fg))" }}>
                Resumo
              </h2>
              <div className="flex flex-col gap-2 text-sm mb-4">
                {items.map(({ product, qty }) => (
                  <div key={product.id} className="flex justify-between">
                    <span style={{ color: "oklch(var(--c-fg-soft))" }}>
                      {product.name} × {qty}
                    </span>
                    <span style={{ color: "oklch(var(--c-fg))" }}>
                      {brl(product.price_cents * qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="border-t pt-3 flex flex-col gap-2 text-sm"
                style={{ borderColor: "oklch(var(--c-line-soft))" }}
              >
                <div className="flex justify-between">
                  <span style={{ color: "oklch(var(--c-fg-soft))" }}>Subtotal</span>
                  <span style={{ color: "oklch(var(--c-fg))" }}>{brl(sub)}</span>
                </div>
                {fee > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: "oklch(var(--c-fg-soft))" }}>
                      Taxa de entrega ({bairroValue})
                    </span>
                    <span style={{ color: "oklch(var(--c-fg))" }}>{brl(fee)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: "oklch(var(--c-accent))" }}>Desconto Pix (5%)</span>
                    <span style={{ color: "oklch(var(--c-accent))" }}>−{brl(discount)}</span>
                  </div>
                )}
                <div
                  className="border-t pt-2 flex justify-between font-semibold"
                  style={{ borderColor: "oklch(var(--c-line-soft))" }}
                >
                  <span style={{ color: "oklch(var(--c-fg))" }}>Total</span>
                  <span
                    className="font-display text-2xl"
                    style={{ color: "oklch(var(--c-fg))" }}
                  >
                    {brl(total)}
                  </span>
                </div>
              </div>
            </Card>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Confirmar pedido
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
