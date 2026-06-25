'use client'

import { useState } from 'react'

interface GuestInfo {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
    agreeToTerms: boolean
}

interface GuestInfoFormProps {
    onSubmit: (data: GuestInfo) => Promise<void>
    isEs: boolean
    loading?: boolean
}

export default function GuestInfoForm({
    onSubmit,
    isEs,
    loading = false,
}: GuestInfoFormProps) {
    const [formData, setFormData] = useState<GuestInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        agreeToTerms: false,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = isEs ? 'El nombre es requerido' : 'First name is required'
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = isEs ? 'El apellido es requerido' : 'Last name is required'
        }
        if (!formData.email.trim()) {
            newErrors.email = isEs ? 'El email es requerido' : 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = isEs ? 'Email inválido' : 'Invalid email'
        }
        if (!formData.phone.trim()) {
            newErrors.phone = isEs ? 'El teléfono es requerido' : 'Phone is required'
        }
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = isEs ? 'Debes aceptar los términos' : 'You must accept the terms'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(formData)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="guest-form">
            <style>{`
        .guest-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .guest-form__section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .guest-form__section-title {
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #0a0a0c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #0a0a0c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input,
        .form-textarea {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #0a0a0c;
          transition: all 0.2s;
          background: #fff;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #1e3a2f;
          box-shadow: 0 0 0 3px rgba(30, 58, 47, 0.1);
        }

        .form-input.error,
        .form-textarea.error {
          border-color: #c33;
          background: #fff9f9;
        }

        .form-error {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #c33;
          margin-top: 0.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .form-checkbox {
          width: 20px;
          height: 20px;
          margin-top: 0.1rem;
          cursor: pointer;
          accent-color: #1e3a2f;
        }

        .form-checkbox-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          color: #555;
          line-height: 1.5;
          cursor: pointer;
          flex: 1;
        }

        .form-checkbox-label a {
          color: #1e3a2f;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .form-checkbox-label a:hover {
          color: #0a0a0c;
        }

        .guest-form__submit {
          padding: 0.9rem 1.5rem;
          background: #0a0a0c;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 44px;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .guest-form__submit:hover:not(:disabled) {
          background: #333;
        }

        .guest-form__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            {/* Datos Personales */}
            <div className="guest-form__section">
                <h3 className="guest-form__section-title">
                    {isEs ? 'Información del Huésped' : 'Guest Information'}
                </h3>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">
                            {isEs ? 'Nombre' : 'First Name'} *
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`form-input ${errors.firstName ? 'error' : ''}`}
                            placeholder={isEs ? 'Tu nombre' : 'Your first name'}
                            disabled={isSubmitting || loading}
                        />
                        {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            {isEs ? 'Apellido' : 'Last Name'} *
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`form-input ${errors.lastName ? 'error' : ''}`}
                            placeholder={isEs ? 'Tu apellido' : 'Your last name'}
                            disabled={isSubmitting || loading}
                        />
                        {errors.lastName && <div className="form-error">{errors.lastName}</div>}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        {isEs ? 'Email' : 'Email'} *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder={isEs ? 'tu@email.com' : 'your@email.com'}
                        disabled={isSubmitting || loading}
                    />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">
                        {isEs ? 'Teléfono' : 'Phone'} *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder={isEs ? '+1 (555) 123-4567' : '+1 (555) 123-4567'}
                        disabled={isSubmitting || loading}
                    />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>
            </div>

            {/* Solicitudes Especiales */}
            <div className="guest-form__section">
                <h3 className="guest-form__section-title">
                    {isEs ? 'Solicitudes Especiales' : 'Special Requests'}
                </h3>
                <div className="form-group">
                    <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder={isEs ? 'Cuéntanos cualquier solicitud especial...' : 'Tell us any special requests...'}
                        disabled={isSubmitting || loading}
                    />
                </div>
            </div>

            {/* Terms */}
            <div className="guest-form__section">
                <div className="form-checkbox-group">
                    <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className={`form-checkbox ${errors.agreeToTerms ? 'error' : ''}`}
                        disabled={isSubmitting || loading}
                    />
                    <label htmlFor="agreeToTerms" className="form-checkbox-label">
                        {isEs ? (
                            <>
                                Acepto la <a href="/politica-privacidad">Política de Privacidad</a> y <a href="/terminos">Términos y Condiciones</a> *
                            </>
                        ) : (
                            <>
                                I agree to the <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms">Terms and Conditions</a> *
                            </>
                        )}
                    </label>
                </div>
                {errors.agreeToTerms && <div className="form-error">{errors.agreeToTerms}</div>}
            </div>

            <button
                type="submit"
                className="guest-form__submit"
                disabled={isSubmitting || loading}
            >
                {isSubmitting || loading ? (isEs ? 'Cargando...' : 'Loading...') : (isEs ? 'Continuar al Pago' : 'Continue to Payment')}
            </button>
        </form>
    )
}