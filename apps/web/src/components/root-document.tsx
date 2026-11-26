import type { ReactNode } from 'react';
import type { Locale } from '@/i18n';
import { inter, sora } from '@/lib/fonts';
import { themeInitScript } from '@/lib/theme';

/** <html> y <body> comunes a los layouts raíz de cada idioma. */
export function RootDocument({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    // El script de tema cambia data-theme antes de hidratar; es esperado.
    <html lang={lang} className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      {/* oxlint-disable-next-line nextjs/no-head-element -- regla del Pages Router; en App Router <head> es válido */}
      <head>
        {/* Contenido estático, sin datos del usuario. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden">{children}</body>
    </html>
  );
}
