import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Order } from "../../domain/types";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { brl } from "../../lib/utils";

const WA_NUMBER = "5524988880000";

export function OrderConfirmedPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setOrder(data));
  }, [id]);

  const waText = order
    ? encodeURIComponent(
        `Olá! Acabei de confirmar meu pedido ${order.order_number} no valor de ${brl(order.total_cents)}. Aguardo a confirmação!`
      )
    : "";

  return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "oklch(var(--c-accent-soft))" }}
      >
        <CheckCircle size={40} style={{ color: "oklch(var(--c-accent))" }} />
      </div>

      <h1
        className="font-display text-4xl font-semibold mb-3"
        style={{ color: "oklch(var(--c-fg))" }}
      >
        Pedido recebido!
      </h1>
      <p className="text-base mb-8" style={{ color: "oklch(var(--c-fg-soft))" }}>
        Obrigada pela confiança! Em breve entraremos em contato para confirmar sua encomenda.
      </p>

      {order && (
        <Card className="p-6 mb-8 text-left">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: "oklch(var(--c-fg-muted))" }}>
                Número do pedido
              </p>
              <p className="font-display text-2xl font-semibold" style={{ color: "oklch(var(--c-primary))" }}>
                {order.order_number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: "oklch(var(--c-fg-muted))" }}>
                Total
              </p>
              <p className="font-display text-2xl font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
                {brl(order.total_cents)}
              </p>
            </div>
          </div>
          <div
            className="border-t pt-4 flex flex-col gap-2 text-sm"
            style={{ borderColor: "oklch(var(--c-line-soft))" }}
          >
            {(order.items as any[]).map((item, i) => (
              <div key={i} className="flex justify-between">
                <span style={{ color: "oklch(var(--c-fg-soft))" }}>
                  {item.name} × {item.qty}
                </span>
                <span style={{ color: "oklch(var(--c-fg))" }}>
                  {brl(item.unit_price_cents * item.qty)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t text-sm" style={{ borderColor: "oklch(var(--c-line-soft))" }}>
            <p style={{ color: "oklch(var(--c-fg-soft))" }}>
              <span className="font-medium" style={{ color: "oklch(var(--c-fg))" }}>
                Entrega:
              </span>{" "}
              {order.delivery_method === "entrega"
                ? `${order.bairro} — ${order.address}`
                : "Retirada no ateliê (Mosela)"}
            </p>
            <p className="mt-1" style={{ color: "oklch(var(--c-fg-soft))" }}>
              <span className="font-medium" style={{ color: "oklch(var(--c-fg))" }}>
                Pagamento:
              </span>{" "}
              {{ pix: "Pix", cartao: "Cartão", dinheiro: "Dinheiro" }[order.payment_method]}
            </p>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="lg" className="w-full">
            <MessageCircle size={18} />
            Confirmar pelo WhatsApp
          </Button>
        </a>
        <Link to="/">
          <Button variant="ghost" size="lg" className="w-full">
            <ArrowLeft size={16} />
            Voltar à loja
          </Button>
        </Link>
      </div>
    </div>
  );
}
