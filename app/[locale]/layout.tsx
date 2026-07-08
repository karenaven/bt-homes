import type { Metadata } from 'next'

type Props = {
    params: Promise<{ locale: string }>
    children: React.ReactNode
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { locale } = await params

    const translations = {
        es: {
            title: 'BT Homes',
            description: 'Sentirse en casa, estés donde estés. Propiedades premium en Argentina y México con servicio integral, atención al detalle y oportunidades de inversión.',
        },
        en: {
            title: 'BT Homes',
            description: 'Feel at home, wherever you are. Premium properties in Argentina and Mexico with comprehensive service, attention to detail and investment opportunities.',
        },
    }

    const trans = translations[locale as keyof typeof translations] || translations.es

    return {
        title: trans.title,
        description: trans.description,
        openGraph: {
            title: trans.title,
            description: trans.description,
            url: `https://www.bthomes.world/${locale}`,
            siteName: 'BT Homes',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'BT Homes',
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: trans.title,
            description: trans.description,
            images: ['/og-image.jpg'],
        },
    }
}

export default function LocaleLayout({ children }: Props) {
    return <>{children}</>
}