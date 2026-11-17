import type { RegistrationFormValues } from '../schemas/registration'

const API_URL = 'http://localhost:3001/registrations'

export type Registration = RegistrationFormValues & {
  id: number
  createdAt: string
}

export async function fetchRegistrations(): Promise<Registration[]> {
  const res = await fetch(`${API_URL}?_sort=id&_order=desc`)
  if (!res.ok) throw new Error(`Error del servidor (${res.status})`)
  return res.json()
}