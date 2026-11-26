import type { ReactNode } from 'react';
import { RootDocument } from '@/components/root-document';
import { buildMetadata } from '@/lib/metadata';
import '../globals.css';

export const metadata = buildMetadata('es');
export { viewport } from '@/lib/metadata';

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
