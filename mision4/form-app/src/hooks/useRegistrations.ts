import { useQuery } from '@tanstack/react-query'
import { fetchRegistrations } from '../api/registrations.ts'

export const registrationsKey = ['registrations'] as const

export function useRegistrations() {
  return useQuery({
    queryKey: registrationsKey,
    queryFn: fetchRegistrations,
  })
}