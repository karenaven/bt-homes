'use client'

import { useState } from 'react'

interface ContactFormProps {
  nameLabel: string
  emailLabel: string
  messageLabel: string
  submitLabel: string
  successMessage: string
}

export default function ContactForm({
  nameLabel,
  emailLabel,
  messageLabel,
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Error al enviar')
        setStatus('error')
        return
      }

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  return (
    <>
      <style>{`
        .cf {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-top: 2rem;
        }
        .cf__input,
        .cf__textarea {
          width: 100%;
          font-family: 'Inter', sans-serif;
          font-size: 0.9375rem;
          font-weight: 300;
          color: #444;
          background: transparent;
          border: none;
          border-bottom: 1px solid #d0cdc5;
          padding: 0.75rem 0;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
        }
        .cf__input::placeholder,
        .cf__textarea::placeholder { color: #444; }
        .cf__input:focus,
        .cf__textarea:focus { border-color: #0a0a0c; }
        .cf__textarea { min-height: 90px; }
        .cf__btn {
          align-self: flex-start;
          font-family: 'Inter', sans-serif;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: #0a0a0c;
          border: none;
          border-radius: 4px;
          padding: 0.875rem 2rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 0.5rem;
        }
        .cf__btn:hover { background: #2a2a2e; }
        .cf__btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .cf__success {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: #1e3a2f;
          background: #e8f5ee;
          padding: 1rem 1.25rem;
          border-radius: 4px;
          margin-top: 1rem;
        }
        .cf__error {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          color: #c0392b;
          margin-top: 0.5rem;
        }
      `}</style>

      {status === 'success' ? (
        <div className="cf__success">{successMessage}</div>
      ) : (
        <form className="cf" onSubmit={handleSubmit} noValidate>
          <input
            className="cf__input"
            type="text"
            placeholder={nameLabel}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="cf__input"
            type="email"
            placeholder={emailLabel}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <textarea
            className="cf__textarea"
            placeholder={messageLabel}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          {status === 'error' && (
            <p className="cf__error">{errorMsg}</p>
          )}
          <button
            className="cf__btn"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? '...' : submitLabel}
          </button>
        </form>
      )}
    </>
  )
}