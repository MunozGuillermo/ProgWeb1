import { z } from 'zod'

export const GAMES = ['valorant', 'lol', 'rocket-league', 'fc'] as const
export const MODES = ['solo', 'equipo'] as const

export const registrationSchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .min(3, 'El nick debe tener al menos 3 caracteres')
      .max(16, 'El nick no puede pasar de 16 caracteres')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Solo letras, números y guion bajo (sin espacios)',
      ),

    email: z
      .string()
      .trim()
      .min(1, 'El email es obligatorio')
      .email('Introduce un email válido'),

    age: z
      .number({ message: 'Introduce tu edad' })
      .int('La edad debe ser un número entero')
      .min(16, 'Debes tener al menos 16 años para inscribirte')
      .max(99, 'Introduce una edad realista'),

    game: z.enum(GAMES, { message: 'Elige un juego' }),

    mode: z.enum(MODES, { message: 'Elige un modo de juego' }),

    // es opcional
    teamName: z
      .string()
      .trim()
      .max(24, 'El nombre del equipo no puede pasar de 24 caracteres'),

    // es opcional
    discord: z
      .string()
      .trim()
      .refine(
        (v) => v === '' || /^[a-z0-9_.]{2,32}$/i.test(v),
        'Usuario de Discord no válido (2-32 caracteres: letras, números, _ y .)',
      ),

    acceptRules: z
      .boolean()
      .refine((v) => v === true, 'Debes aceptar las reglas del torneo'),
  })
  //si juegas en equipo, el nombre es obligatorio
  .refine((data) => data.mode === 'solo' || data.teamName.length >= 3, {
    message: 'El nombre del equipo es obligatorio (mínimo 3 caracteres)',
    path: ['teamName'],
  })

export type RegistrationFormValues = z.infer<typeof registrationSchema>

export const GAME_LABELS: Record<(typeof GAMES)[number], string> = {
  valorant: 'Valorant',
  lol: 'League of Legends',
  'rocket-league': 'Rocket League',
  fc: 'EA FC',
}