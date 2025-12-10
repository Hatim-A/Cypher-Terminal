import './globals.css'
import type { Metadata } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import { AppShell } from '@/components/AppShell'

const mono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Cipher Terminal',
    description: 'Professional Crypto Terminal',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${mono.variable} ${inter.variable} font-sans bg-[#0c0c0c] text-[#eaeaea] antialiased overflow-hidden`}>
                <AppShell>
                    {children}
                </AppShell>
            </body>
        </html>
    )
}
