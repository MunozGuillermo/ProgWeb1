import { useRegistrations } from '../hooks/useRegistrations'
import { GAME_LABELS } from '../schemas/registration'

export function RegistrationList() {
  const { data, isPending, isError, error, refetch, isFetching } = useRegistrations()

  if (isPending) return <p role="status">Cargando inscripciones…</p>

  if (isError) {
    return (
      <div role="alert" className="error">
        <p>No se pudieron cargar las inscripciones: {error.message}</p>
        <button type="button" onClick={() => refetch()} disabled={isFetching}>
          Reintentar
        </button>
      </div>
    )
  }

  if (data.length === 0) return <p>Todavía no hay inscritos. ¡Sé el primero!</p>

  return (
    <ul className="list" aria-busy={isFetching}>
      {data.map((r) => (
        <li key={r.id}>
          <strong>{r.nickname}</strong> · {GAME_LABELS[r.game]} ·{' '}
          {r.mode === 'solo' ? 'Individual' : `Equipo ${r.teamName}`}
        </li>
      ))}
    </ul>
  )
}