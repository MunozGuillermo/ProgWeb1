import { useRegistrations } from '../hooks/useRegistrations'
import { GAME_LABELS } from '../schemas/registration'

export function RegistrationList() {
  const { data, isPending, isError } = useRegistrations()

  if (isPending) return <p>Cargando inscripciones…</p>
  if (isError) return <p>No se pudieron cargar las inscripciones.</p>

  return (
    <ul>
      {data.map((r) => (
        <li key={r.id}>
          <strong>{r.nickname}</strong> · {GAME_LABELS[r.game]} ·{' '}
          {r.mode === 'solo' ? 'Individual' : `Equipo ${r.teamName}`}
        </li>
      ))}
    </ul>
  )
}