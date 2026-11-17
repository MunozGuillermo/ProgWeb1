import type { ReactNode } from 'react'

type Props = {
  id: string
  label: string
  error?: string
  children: ReactNode
}

export function Field({ id, label, error, children }: Props) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="error">
          {error}
        </p>
      )}
    </div>
  )
}