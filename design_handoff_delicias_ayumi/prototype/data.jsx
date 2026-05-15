// data.jsx — mock data for Delicias Ayumi + tiny persistent store

const STORAGE_KEY = "delicias-ayumi:v3";

const SEED_PRODUCTS = [
  {
    id: "p-bolo-cenoura",
    name: "Bolo de Cenoura com Brigadeiro",
    cat: "Bolos",
    short: "Bolo fofinho com cobertura cremosa de brigadeiro feita à colher.",
    price: 89.0,
    size: "Serve 15–20 pessoas · 1,8 kg",
    tags: ["Mais pedido", "Clássico"],
    stock: 12,
    active: true,
    cost: 28.4,
    swatch: ["#f4a261", "#a0522d", "#fff3d6"],
  },
  {
    id: "p-bolo-prestigio",
    name: "Bolo Prestígio",
    cat: "Bolos",
    short: "Massa de chocolate, recheio de coco gelado e ganache.",
    price: 115.0,
    size: "Serve 20–25 pessoas · 2,2 kg",
    tags: ["Festa"],
    stock: 6,
    active: true,
    cost: 42.7,
    swatch: ["#3a1f12", "#f8eede", "#d4af7a"],
  },
  {
    id: "p-torta-limao",
    name: "Torta Mousse de Limão",
    cat: "Tortas",
    short: "Base crocante, mousse aerada de limão siciliano, merengue maçaricado.",
    price: 95.0,
    size: "Aro 24 · 12 fatias",
    tags: ["Refrescante"],
    stock: 8,
    active: true,
    cost: 31.2,
    swatch: ["#f9e98a", "#9ad36a", "#fffae0"],
  },
  {
    id: "p-torta-frutas",
    name: "Torta de Frutas Vermelhas",
    cat: "Tortas",
    short: "Creme de baunilha, frutas frescas da serra, geleia natural.",
    price: 125.0,
    size: "Aro 26 · 14 fatias",
    tags: ["Sazonal"],
    stock: 5,
    active: true,
    cost: 48.5,
    swatch: ["#d62246", "#f7c8c8", "#fff5e8"],
  },
  {
    id: "p-empadao-frango",
    name: "Empadão de Frango Caipira",
    cat: "Empadões",
    short: "Massa amanteigada, recheio cremoso com requeijão e palmito.",
    price: 78.0,
    size: "Serve 8–10 · 1,4 kg",
    tags: ["Mais pedido"],
    stock: 18,
    active: true,
    cost: 26.8,
    swatch: ["#f4c95d", "#c47628", "#fff1c6"],
  },
  {
    id: "p-empadao-palmito",
    name: "Empadão de Palmito",
    cat: "Empadões",
    short: "Recheio de palmito pupunha refogado com azeitona e ervas.",
    price: 82.0,
    size: "Serve 8–10 · 1,4 kg",
    tags: ["Vegetariano"],
    stock: 9,
    active: true,
    cost: 29.4,
    swatch: ["#e8d878", "#6ea049", "#fcf7d0"],
  },
  {
    id: "p-torta-banoffee",
    name: "Torta Banoffee",
    cat: "Tortas",
    short: "Doce de leite caseiro, banana, chantilly e raspas de chocolate.",
    price: 110.0,
    size: "Aro 24 · 12 fatias",
    tags: ["Novo"],
    stock: 4,
    active: true,
    cost: 36.9,
    swatch: ["#e8b16a", "#2c1305", "#fff0c8"],
  },
  {
    id: "p-bolo-nozes",
    name: "Bolo de Nozes",
    cat: "Bolos",
    short: "Massa úmida com nozes e calda de doce de leite.",
    price: 132.0,
    size: "Serve 25 pessoas · 2,4 kg",
    tags: ["Premium"],
    stock: 3,
    active: true,
    cost: 52.1,
    swatch: ["#9b6633", "#f5d9a8", "#fff5e0"],
  },
];

const SEED_ORDERS = [
  { id: "#2041", customer: "Mariana Souza", bairro: "Centro", total: 174, items: 2, when: "Hoje 11:24", status: "Em produção", method: "Entrega" },
  { id: "#2040", customer: "Beatriz Lopes", bairro: "Quitandinha", total: 89, items: 1, when: "Hoje 10:02", status: "Saiu p/ entrega", method: "Entrega" },
  { id: "#2039", customer: "Ricardo Lima", bairro: "Itaipava", total: 235, items: 3, when: "Hoje 09:18", status: "Pronto p/ retirada", method: "Retirada" },
  { id: "#2038", customer: "Juliana Mendes", bairro: "Bingen", total: 110, items: 1, when: "Ontem 17:42", status: "Entregue", method: "Entrega" },
  { id: "#2037", customer: "Felipe Castro", bairro: "Valparaíso", total: 78, items: 1, when: "Ontem 16:10", status: "Entregue", method: "Entrega" },
  { id: "#2036", customer: "Carla Pinto", bairro: "Corrêas", total: 197, items: 2, when: "Ontem 14:33", status: "Entregue", method: "Entrega" },
  { id: "#2035", customer: "André Vieira", bairro: "Centro", total: 95, items: 1, when: "12/05 19:15", status: "Entregue", method: "Retirada" },
];

const SEED_CASH = [
  { id: "c-1",  type: "in",  cat: "Vendas",      desc: "Pedido #2041 · Mariana",     amount: 174, when: "Hoje 11:24" },
  { id: "c-2",  type: "in",  cat: "Vendas",      desc: "Pedido #2040 · Beatriz",     amount: 89,  when: "Hoje 10:02" },
  { id: "c-3",  type: "in",  cat: "Vendas",      desc: "Pedido #2039 · Ricardo",     amount: 235, when: "Hoje 09:18" },
  { id: "c-4",  type: "out", cat: "Ingredientes",desc: "Hortifruti · frutas vermelhas", amount: 86, when: "Hoje 08:40" },
  { id: "c-5",  type: "out", cat: "Embalagens",  desc: "Caixas kraft 30un",          amount: 142, when: "Ontem 16:00" },
  { id: "c-6",  type: "in",  cat: "Vendas",      desc: "Pedido #2038 · Juliana",     amount: 110, when: "Ontem 17:42" },
  { id: "c-7",  type: "in",  cat: "Vendas",      desc: "Pedido #2037 · Felipe",      amount: 78,  when: "Ontem 16:10" },
  { id: "c-8",  type: "out", cat: "Combustível",  desc: "Gasolina · entregas",        amount: 95,  when: "Ontem 11:20" },
  { id: "c-9",  type: "in",  cat: "Vendas",      desc: "Pedido #2036 · Carla",       amount: 197, when: "Ontem 14:33" },
  { id: "c-10", type: "out", cat: "Ingredientes",desc: "Atacadão · laticínios",      amount: 218, when: "12/05 09:00" },
  { id: "c-11", type: "in",  cat: "Vendas",      desc: "Pedido #2035 · André",       amount: 95,  when: "12/05 19:15" },
];

// 14 days of revenue for chart
const SEED_REVENUE_DAILY = [
  240, 310, 285, 410, 360, 520, 480,
  390, 445, 520, 615, 540, 670, 712
];

// Cash flow categories shown in the breakdown ring
const CASH_CATS = ["Vendas", "Ingredientes", "Embalagens", "Combustível", "Marketing", "Outros"];

// Petrópolis neighborhoods for delivery
const PETRO_BAIRROS = [
  { name: "Centro",       fee: 8,  km: 2 },
  { name: "Quitandinha",  fee: 10, km: 4 },
  { name: "Bingen",       fee: 10, km: 4 },
  { name: "Valparaíso",   fee: 12, km: 6 },
  { name: "Corrêas",      fee: 15, km: 9 },
  { name: "Itaipava",     fee: 22, km: 18 },
  { name: "Cascatinha",   fee: 12, km: 6 },
  { name: "Mosela",       fee: 10, km: 5 },
];

// — tiny store with localStorage persistence ————————————————————
function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function defaultStore() {
  return {
    products: SEED_PRODUCTS.map(p => ({ ...p })),
    orders:   SEED_ORDERS.map(o => ({ ...o })),
    cash:     SEED_CASH.map(c => ({ ...c })),
    revenue:  SEED_REVENUE_DAILY,
  };
}

function saveStore(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
}

function resetStore() {
  const s = defaultStore();
  saveStore(s);
  return s;
}

// — global hook —
function useStore() {
  const [state, setState] = React.useState(() => loadStore() || defaultStore());
  React.useEffect(() => { saveStore(state); }, [state]);

  const api = React.useMemo(() => ({
    state,
    addProduct(p) {
      setState(s => ({ ...s, products: [{ ...p, id: "p-" + Date.now() }, ...s.products] }));
    },
    updateProduct(id, patch) {
      setState(s => ({ ...s, products: s.products.map(p => p.id === id ? { ...p, ...patch } : p) }));
    },
    deleteProduct(id) {
      setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) }));
    },
    addCash(entry) {
      setState(s => ({ ...s, cash: [{ ...entry, id: "c-" + Date.now() }, ...s.cash] }));
    },
    deleteCash(id) {
      setState(s => ({ ...s, cash: s.cash.filter(c => c.id !== id) }));
    },
    setOrderStatus(id, status) {
      setState(s => ({ ...s, orders: s.orders.map(o => o.id === id ? { ...o, status } : o) }));
    },
    reset() { setState(resetStore()); },
  }), [state]);

  return api;
}

// Helpers
function brl(n) {
  return "R$ " + Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function brlShort(n) {
  if (Math.abs(n) >= 1000) return "R$ " + (n / 1000).toFixed(1).replace(".", ",") + "k";
  return brl(n);
}

Object.assign(window, {
  SEED_PRODUCTS, SEED_ORDERS, SEED_CASH, SEED_REVENUE_DAILY,
  CASH_CATS, PETRO_BAIRROS,
  useStore, loadStore, saveStore, resetStore, defaultStore,
  brl, brlShort,
});
