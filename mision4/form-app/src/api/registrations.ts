import type { RegistrationFormValues } from '../schemas/registration'
import { z } from 'zod'
import { GAMES, MODES } from '../schemas/registration'

const API_URL = 'http://localhost:3001/registrations'

const registrationRecordSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  email: z.string(),
  age: z.number(),
  game: z.enum(GAMES),
  mode: z.enum(MODES),
  teamName: z.string(),
  discord: z.string(),
  acceptRules: z.boolean(),
  createdAt: z.string(),
})

export async function fetchRegistrations(): Promise<Registration[]> {
  const res = await fetch(`${API_URL}?_sort=id&_order=desc`)
  if (!res.ok) throw new Error(`Error del servidor (${res.status})`)

  const parsed = z.array(registrationRecordSchema).safeParse(await res.json())
  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error('El servidor devolvió datos con formato inesperado')
  }
  return parsed.data
}

export type Registration = RegistrationFormValues & {
  id: number
  createdAt: string
}

export async function createRegistration(
  values: RegistrationFormValues,
): Promise<Registration> {
  // Extra: evitar nicks duplicados
  const dup = await fetch(`${API_URL}?nickname=${encodeURIComponent(values.nickname)}`)
  if (dup.ok && (await dup.json()).length > 0) {
    throw new Error('Ese nick ya está inscrito')
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, createdAt: new Date().toISOString() }),
  })
  if (!res.ok) throw new Error(`No se pudo inscribir (${res.status})`)
  return res.json()
}