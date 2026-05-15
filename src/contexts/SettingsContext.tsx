import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { SupabaseSettingsRepository } from '@/lib/infrastructure/repositories/SupabaseSettingsRepository'
import { GetSettingsUseCase } from '@/lib/application/use-cases/GetSettingsUseCase'

export type SiteSettings = {
  'contato.whatsapp': string
  'contato.email': string
  'contato.instagram': string
  'contato.endereco': string
  'announce.texto': string
  'hero.paragrafo': string
  'sobre.titulo': string
  'sobre.texto': string
}

const DEFAULTS: SiteSettings = {
  'contato.whatsapp': '5524988880000',
  'contato.email': 'oi@deliciasayumi.com.br',
  'contato.instagram': 'delicias_ayumi',
  'contato.endereco': 'R. Antônio Manoel de França, 187 Casa B · Corrêas, Petrópolis/RJ',
  'announce.texto': 'Entregamos em toda Petrópolis · Retirada em Corrêas ♡',
  'hero.paragrafo': 'Receitas que atravessaram três gerações, preparadas no nosso ateliê em Corrêas. Encomende para sua mesa ou retire conosco.',
  'sobre.titulo': 'A receita é da minha avó. O ateliê é meu.',
  'sobre.texto': 'Sou a Ayumi. Há alguns anos, transformei a cozinha de casa em ateliê e nunca mais parei. Cada bolo sai daqui assinado por mim — e provado três vezes antes de te entregar.',
}

const SettingsContext = createContext<SiteSettings>(DEFAULTS)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)

  useEffect(() => {
    const repo = new SupabaseSettingsRepository(supabase)
    new GetSettingsUseCase(repo).execute()
      .then((rows) => {
        const merged = { ...DEFAULTS }
        for (const row of rows) {
          if (row.key in merged) {
            (merged as Record<string, string>)[row.key] = row.value
          }
        }
        setSettings(merged)
      })
      .catch(() => {
        // table not yet created — use defaults silently
      })
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SiteSettings {
  return useContext(SettingsContext)
}
