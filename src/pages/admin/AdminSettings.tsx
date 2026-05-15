import { useState, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SupabaseSettingsRepository } from '@/lib/infrastructure/repositories/SupabaseSettingsRepository'
import { GetSettingsUseCase } from '@/lib/application/use-cases/GetSettingsUseCase'
import type { Setting } from '@/lib/domain/entities/Setting'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({})
  const [loading, setLoading] = useState(true)

  const repo = new SupabaseSettingsRepository(supabase)

  useEffect(() => {
    new GetSettingsUseCase(repo).execute()
      .then((data) => {
        setSettings(data)
        const initial: Record<string, string> = {}
        for (const s of data) initial[s.key] = s.value
        setValues(initial)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (key: string) => {
    setSaveState((s) => ({ ...s, [key]: 'saving' }))
    try {
      await repo.update(key, values[key] ?? '')
      setSaveState((s) => ({ ...s, [key]: 'saved' }))
      setTimeout(() => setSaveState((s) => ({ ...s, [key]: 'idle' })), 2000)
    } catch {
      setSaveState((s) => ({ ...s, [key]: 'error' }))
    }
  }

  const groups = [...new Set(settings.map((s) => s.groupName))]

  const isTextarea = (key: string) =>
    key === 'hero.paragrafo' || key === 'sobre.texto' || key === 'contato.endereco'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" style={{ color: 'oklch(var(--c-primary))' }} />
      </div>
    )
  }

  if (settings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="font-display text-xl mb-2" style={{ color: 'oklch(var(--c-fg))' }}>
          Tabela de configurações não encontrada
        </p>
        <p className="text-sm mb-6" style={{ color: 'oklch(var(--c-fg-soft))' }}>
          Execute a migration no Supabase para ativar as configurações.
        </p>
        <div
          className="rounded-xl p-4 text-left text-xs font-mono overflow-x-auto"
          style={{ background: 'oklch(var(--c-surface-2))', color: 'oklch(var(--c-fg))' }}
        >
          <pre>{`-- Cole no SQL Editor do Supabase Dashboard
-- https://supabase.com/dashboard/project/utesgzaybftosklfuhnt/sql/new

create table if not exists ayumi_settings (
  key        text primary key,
  value      text not null default '',
  label      text not null default '',
  group_name text not null default 'Geral'
);
alter table ayumi_settings enable row level security;
create policy "anon_select" on ayumi_settings for select to anon using (true);
create policy "auth_all" on ayumi_settings for all to authenticated using (true) with check (true);

insert into ayumi_settings (key, value, label, group_name) values
  ('contato.whatsapp',  '5524988880000', 'Número WhatsApp (só dígitos)', 'Contato'),
  ('contato.email',     'oi@deliciasayumi.com.br', 'E-mail de contato', 'Contato'),
  ('contato.instagram', 'delicias_ayumi', 'Instagram (sem @)', 'Contato'),
  ('contato.endereco',  'R. Antônio Manoel de França, 187 Casa B · Corrêas, Petrópolis/RJ', 'Endereço completo', 'Contato'),
  ('announce.texto',    'Entregamos em toda Petrópolis · Retirada em Corrêas ♡', 'Faixa de anúncio', 'Site'),
  ('hero.paragrafo',    'Receitas que atravessaram três gerações, preparadas no nosso ateliê em Corrêas. Encomende para sua mesa ou retire conosco.', 'Parágrafo do hero', 'Site'),
  ('sobre.titulo',      'A receita é da minha avó. O ateliê é meu.', 'Título da seção Sobre', 'Site'),
  ('sobre.texto',       'Sou a Ayumi. Há alguns anos, transformei a cozinha de casa em ateliê e nunca mais parei. Cada bolo sai daqui assinado por mim — e provado três vezes antes de te entregar.', 'Texto da seção Sobre', 'Site')
on conflict (key) do nothing;`}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold" style={{ color: 'oklch(var(--c-fg))' }}>
          Configurações
        </h1>
        <p className="text-sm mt-1" style={{ color: 'oklch(var(--c-fg-muted))' }}>
          Alterações refletem no site imediatamente após salvar.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <Card key={group} className="p-6">
            <h2
              className="font-semibold text-base mb-5 pb-3 border-b"
              style={{
                color: 'oklch(var(--c-fg))',
                borderColor: 'oklch(var(--c-line-soft))',
              }}
            >
              {group}
            </h2>

            <div className="flex flex-col gap-5">
              {settings
                .filter((s) => s.groupName === group)
                .map((setting) => (
                  <div key={setting.key} className="flex flex-col gap-2">
                    {isTextarea(setting.key) ? (
                      <Textarea
                        label={setting.label}
                        value={values[setting.key] ?? ''}
                        rows={3}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [setting.key]: e.target.value }))
                        }
                      />
                    ) : (
                      <Input
                        label={setting.label}
                        value={values[setting.key] ?? ''}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [setting.key]: e.target.value }))
                        }
                      />
                    )}
                    <div className="flex items-center gap-2 justify-end">
                      {saveState[setting.key] === 'saved' && (
                        <span
                          className="text-xs flex items-center gap-1"
                          style={{ color: 'oklch(var(--c-accent))' }}
                        >
                          <Check size={12} />
                          Salvo
                        </span>
                      )}
                      {saveState[setting.key] === 'error' && (
                        <span className="text-xs" style={{ color: 'oklch(var(--c-danger))' }}>
                          Erro ao salvar
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="primary"
                        loading={saveState[setting.key] === 'saving'}
                        onClick={() => handleSave(setting.key)}
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
