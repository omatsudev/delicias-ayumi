import { useEffect, useState, useRef } from "react";
import { Plus, Search, Pencil, Trash2, ImagePlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import type { Product, ProductCategory } from "../../domain/types";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Tag } from "../../components/ui/Tag";
import { Modal, ConfirmModal } from "../../components/ui/Modal";
import { Input, Textarea, Select } from "../../components/ui/Input";
import { ProductImage } from "../../components/ui/ProductImage";
import { brl, slugify } from "../../lib/utils";

const schema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  category: z.enum(["Bolos", "Tortas", "Empadões"]),
  description: z.string().min(10, "Descrição obrigatória"),
  size_label: z.string().min(3, "Tamanho obrigatório"),
  price_cents: z.coerce.number().min(100, "Preço mínimo R$ 1,00"),
  cost_cents: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  active: z.boolean().default(true),
  image_url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function calcMargin(price: number, cost: number) {
  if (price === 0) return 0;
  return Math.round(((price - cost) / price) * 100);
}

function MarginBadge({ margin }: { margin: number }) {
  const color =
    margin > 60
      ? "oklch(var(--c-accent))"
      : margin > 40
      ? "oklch(var(--c-fg))"
      : "oklch(var(--c-warn))";
  return (
    <span className="text-xs font-semibold" style={{ color }}>
      {margin}%
    </span>
  );
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const priceVal = watch("price_cents") ?? 0;
  const costVal  = watch("cost_cents") ?? 0;
  const margin   = calcMargin(Number(priceVal), Number(costVal));

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from("ayumi_products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    reset({ active: true, stock: 0, cost_cents: 0, price_cents: 0, image_url: '' });
    setImageFile(null);
    setImagePreview('');
    setUploadError('');
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    reset({
      name: p.name,
      category: p.category,
      description: p.description,
      size_label: p.size_label,
      price_cents: p.price_cents,
      cost_cents: p.cost_cents,
      stock: p.stock,
      active: p.active,
      image_url: p.image_url ?? '',
    });
    setImageFile(null);
    setImagePreview(p.image_url ?? '');
    setUploadError('');
    setModalOpen(true);
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadError('');
  }

  async function uploadImage(file: File, slug: string): Promise<string> {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('ayumi-products').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('ayumi-products').getPublicUrl(path);
    return data.publicUrl;
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setUploadError('');
    try {
      const slug = slugify(data.name);
      let imageUrl = data.image_url ?? '';

      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile, slug);
        } catch {
          setUploadError('Erro ao fazer upload. Verifique se o bucket "ayumi-products" existe no Supabase Storage.');
          setSaving(false);
          return;
        }
      }

      if (editing) {
        await supabase
          .from("ayumi_products")
          .update({
            name: data.name,
            category: data.category as ProductCategory,
            description: data.description,
            size_label: data.size_label,
            price_cents: data.price_cents,
            cost_cents: data.cost_cents,
            stock: data.stock,
            active: data.active,
            slug,
            image_url: imageUrl || null,
          })
          .eq("id", editing.id);
      } else {
        await supabase.from("ayumi_products").insert({
          name: data.name,
          slug,
          category: data.category as ProductCategory,
          description: data.description,
          size_label: data.size_label,
          price_cents: data.price_cents,
          cost_cents: data.cost_cents,
          stock: data.stock,
          active: data.active,
          tags: [],
          swatch: [],
          gallery_urls: [],
          image_url: imageUrl || null,
        });
      }
      setModalOpen(false);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from("ayumi_products").delete().eq("id", deleteTarget.id);
    setDeleteTarget(null);
    setDeleting(false);
    fetchProducts();
  };

  const handleToggleActive = async (p: Product) => {
    await supabase.from("ayumi_products").update({ active: !p.active }).eq("id", p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !x.active } : x));
  };

  const filtered = products.filter((p) =>
    search === "" ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
          Produtos
        </h1>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} />
          Novo produto
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 flex items-center gap-2">
        <Search size={16} style={{ color: "oklch(var(--c-fg-muted))" }} />
        <input
          type="text"
          placeholder="Buscar por nome ou categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[oklch(var(--c-fg-muted))]"
          style={{ color: "oklch(var(--c-fg))" }}
        />
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-left"
                style={{ borderColor: "oklch(var(--c-line-soft))" }}
              >
                {["Produto", "Categoria", "Preço", "Custo", "Margem", "Estoque", "Ativo", ""].map((h) => (
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
              ) : filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-[oklch(var(--c-surface-2)/0.5)] transition-colors"
                  style={{ borderColor: "oklch(var(--c-line-soft))" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        imageUrl={p.image_url}
                        name={p.name}
                        category={p.category}
                        swatch={p.swatch}
                        aspectRatio="1/1"
                        className="w-10 h-10 rounded-lg shrink-0"
                      />
                      <div>
                        <p className="font-medium" style={{ color: "oklch(var(--c-fg))" }}>{p.name}</p>
                        <p className="text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>{p.size_label}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Tag tone="neutral">{p.category}</Tag>
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
                    {brl(p.price_cents)}
                  </td>
                  <td className="px-4 py-3" style={{ color: "oklch(var(--c-fg-soft))" }}>
                    {brl(p.cost_cents)}
                  </td>
                  <td className="px-4 py-3">
                    <MarginBadge margin={calcMargin(p.price_cents, p.cost_cents)} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-semibold text-xs"
                      style={{ color: p.stock < 5 ? "oklch(var(--c-danger))" : "oklch(var(--c-fg))" }}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className="relative w-10 h-5 rounded-full transition-colors"
                      style={{ background: p.active ? "oklch(var(--c-primary))" : "oklch(var(--c-line))" }}
                      aria-label={p.active ? "Desativar produto" : "Ativar produto"}
                    >
                      <span
                        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                        style={{ left: p.active ? "calc(100% - 1.125rem)" : "2px" }}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-[oklch(var(--c-surface-2))] transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={14} style={{ color: "oklch(var(--c-fg-soft))" }} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        aria-label="Excluir"
                      >
                        <Trash2 size={14} style={{ color: "oklch(var(--c-danger))" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-sm" style={{ color: "oklch(var(--c-fg-muted))" }}>
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      </Card>

      {/* Modal criar/editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar produto" : "Novo produto"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" loading={saving} onClick={handleSubmit(onSubmit)}>
              {editing ? "Salvar alterações" : "Criar produto"}
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image picker */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-2" style={{ color: 'oklch(var(--c-fg-soft))' }}>
              Imagem do produto
            </label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border" style={{ borderColor: 'oklch(var(--c-line))' }}>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(''); setValue('image_url', ''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                >
                  <X size={14} color="#fff" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}
                >
                  Trocar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-[oklch(var(--c-primary))]"
                style={{ borderColor: 'oklch(var(--c-line))', color: 'oklch(var(--c-fg-muted))' }}
              >
                <ImagePlus size={24} />
                <span className="text-sm">Clique para selecionar imagem</span>
                <span className="text-xs">JPG, PNG, WEBP</span>
              </button>
            )}
            {uploadError && <p className="text-xs mt-1" style={{ color: 'oklch(var(--c-danger))' }}>{uploadError}</p>}
          </div>

          <div className="md:col-span-2">
            <Input label="Nome do produto" error={errors.name?.message} {...register("name")} />
          </div>
          <Select
            label="Categoria"
            options={[
              { value: "Bolos", label: "Bolos" },
              { value: "Tortas", label: "Tortas" },
              { value: "Empadões", label: "Empadões" },
            ]}
            error={errors.category?.message}
            {...register("category")}
          />
          <Input label="Tamanho" placeholder='Serve 15–20 pessoas · 1,8 kg' error={errors.size_label?.message} {...register("size_label")} />
          <div className="md:col-span-2">
            <Textarea label="Descrição" rows={2} error={errors.description?.message} {...register("description")} />
          </div>
          <Input
            label="Preço de venda (centavos)"
            type="number"
            placeholder="8900"
            hint="R$ 89,00 → 8900"
            error={errors.price_cents?.message}
            {...register("price_cents")}
          />
          <Input
            label="Custo (centavos)"
            type="number"
            placeholder="2840"
            error={errors.cost_cents?.message}
            {...register("cost_cents")}
          />
          <Input label="Estoque" type="number" placeholder="10" error={errors.stock?.message} {...register("stock")} />

          {/* Margem calculada */}
          <div
            className="flex flex-col items-center justify-center rounded-xl p-4"
            style={{ background: "oklch(var(--c-primary-soft))" }}
          >
            <span className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "oklch(var(--c-primary))" }}>
              Margem calculada
            </span>
            <span
              className="font-display text-3xl font-semibold"
              style={{
                color: margin > 60 ? "oklch(var(--c-accent))" : margin > 40 ? "oklch(var(--c-primary))" : "oklch(var(--c-warn))"
              }}
            >
              {margin}%
            </span>
          </div>
        </form>
      </Modal>

      {/* Confirm delete */}
      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir produto"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </div>
  );
}
