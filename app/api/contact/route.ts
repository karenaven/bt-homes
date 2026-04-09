import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

const contactConfigQuery = groq`
  *[_type == "contactPage"][0] {
    adminEmail,
    emailSubject,
  }
`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Traer config desde Sanity
    const config = await client.fetch(contactConfigQuery)

    if (!config?.adminEmail) {
      return NextResponse.json(
        { error: 'Email de destino no configurado en Sanity' },
        { status: 500 }
      )
    }

    // Enviar con Resend
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'BT Homes <onboarding@resend.dev>', // cambiá por tu dominio verificado
      to: config.adminEmail,
      replyTo: email,
      subject: config.emailSubject ?? 'Nuevo contacto desde BT Homes',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1e3a2f; margin-bottom: 24px;">Nuevo mensaje de contacto</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dc; font-weight: 600; width: 100px;">Nombre</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dc;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dc; font-weight: 600;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dc;">
                <a href="mailto:${email}" style="color: #1e3a2f;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 600; vertical-align: top;">Mensaje</td>
              <td style="padding: 12px 0; white-space: pre-line;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 32px; color: #888; font-size: 12px;">
            Enviado desde el formulario de contacto de BT Homes
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}