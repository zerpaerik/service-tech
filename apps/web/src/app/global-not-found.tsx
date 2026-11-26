import type { Metadata } from 'next';
import { RootDocument } from '@/components/root-document';
import { buttonStyles } from '@/lib/ui';
import { LogoMark } from '@/components/logo';
import { es } from '@/i18n/es';
import { en } from '@/i18n/en';
import './globals.css';

export const metadata: Metadata = {
  title: `404 · ${es.notFound.title}`,
  robots: { index: false },
};

/** 404 para cualquier ruta inexistente (hay un layout raíz por idioma). */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="es">
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
        <LogoMark id="not-found" size={56} />
        <p className="font-display text-6xl font-bold tracking-tight">
          <span className="text-gradient">404</span>
        </p>
        <h1 className="font-display text-2xl font-bold">{es.notFound.title}</h1>
        <p className="max-w-md text-fg-muted">{es.notFound.text}</p>
        {/* Cada idioma tiene su layout raíz: la navegación recarga la página igual que <a>. */}
        {/* oxlint-disable nextjs/no-html-link-for-pages */}
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <a href="/" className={buttonStyles.primary}>
            {es.notFound.back}
          </a>
          <a href="/en" lang="en" className={buttonStyles.ghost}>
            {en.notFound.back} (English)
          </a>
        </div>
        {/* oxlint-enable nextjs/no-html-link-for-pages */}
      </main>
    </RootDocument>
  );
}
