import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRegistration } from '../api/registrations'
import { registrationsKey } from './useRegistrations'

export function useCreateRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRegistration,
    onSuccess: () => {
      // El listado se vuelve a pedir y se actualiza solo
      queryClient.invalidateQueries({ queryKey: registrationsKey })
    },
  })
}