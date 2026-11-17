import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registrationSchema,
  GAMES,
  MODES,
  GAME_LABELS,
  type RegistrationFormValues,
} from '../schemas/registration'
import { Field } from './Field'
import { useCreateRegistration } from '../hooks/useCreateRegistration'

export function RegistrationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    defaultValues: {
      nickname: '',
      email: '',
      teamName: '',
      discord: '',
      acceptRules: false,
    },
  })

    const mutation = useCreateRegistration()

    const onSubmit = (values: RegistrationFormValues) => {
    mutation.mutate(values, { onSuccess: () => reset() })
    }

    {mutation.isError && (
        <p role="alert" className="error">{mutation.error.message}</p>
    )}
    {mutation.isSuccess && (
        <p role="status" className="success">¡Inscripción registrada!</p>
    )}

    // botón:
    <button type="submit" disabled={mutation.isPending}>
    {mutation.isPending ? 'Enviando…' : 'Inscribirme'}
    </button>

  // Atributos de accesibilidad comunes a cada input
  const a11y = (name: keyof RegistrationFormValues) => ({
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Inscríbete al torneo</h2>

      <Field id="nickname" label="Nick" error={errors.nickname?.message}>
        <input id="nickname" {...a11y('nickname')} {...register('nickname')} />
      </Field>

      <Field id="email" label="Email" error={errors.email?.message}>
        <input id="email" type="email" {...a11y('email')} {...register('email')} />
      </Field>

      <Field id="age" label="Edad" error={errors.age?.message}>
        <input
          id="age"
          type="number"
          {...a11y('age')}
          {...register('age', { valueAsNumber: true })}
        />
      </Field>

      <Field id="game" label="Juego" error={errors.game?.message}>
        <select id="game" {...a11y('game')} {...register('game')}>
          <option value="">Elige un juego…</option>
          {GAMES.map((g) => (
            <option key={g} value={g}>
              {GAME_LABELS[g]}
            </option>
          ))}
        </select>
      </Field>

      <Field id="mode" label="Modo" error={errors.mode?.message}>
        <select id="mode" {...a11y('mode')} {...register('mode')}>
          <option value="">Elige un modo…</option>
          {MODES.map((m) => (
            <option key={m} value={m}>
              {m === 'solo' ? 'Individual' : 'Por equipos'}
            </option>
          ))}
        </select>
      </Field>

      <Field id="teamName" label="Nombre del equipo (si juegas en equipo)" error={errors.teamName?.message}>
        <input id="teamName" {...a11y('teamName')} {...register('teamName')} />
      </Field>

      <Field id="discord" label="Discord (opcional)" error={errors.discord?.message}>
        <input id="discord" {...a11y('discord')} {...register('discord')} />
      </Field>

      <Field id="acceptRules" label="Acepto las reglas del torneo" error={errors.acceptRules?.message}>
        <input id="acceptRules" type="checkbox" {...a11y('acceptRules')} {...register('acceptRules')} />
      </Field>

      <button type="submit" disabled={isSubmitting}>
        Inscribirme
      </button>
    </form>
  )
}