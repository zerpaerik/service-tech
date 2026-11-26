'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { THEME_STORAGE_KEY, themeColors, type Theme } from '@/lib/theme';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', themeColors[theme]));
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Alterna entre modo claro y oscuro y recuerda la elección. Mientras la persona
 * no elija, la página sigue el tema del sistema. El ícono se elige por CSS
 * (variante `light:`), así no depende del estado de React ni parpadea al hidratar.
 */
export function ThemeToggle({ label, className = '' }: { label: string; className?: string }) {
  useEffect(() => {
    applyTheme(currentTheme());
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) => {
      if (!storedTheme()) applyTheme(event.matches ? 'light' : 'dark');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Sin almacenamiento (modo privado): el cambio dura hasta recargar.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex size-10 flex-none cursor-pointer items-center justify-center rounded-[10px] border border-line-2 bg-tint/4 text-fg-soft transition-colors hover:bg-tint/8 hover:text-fg sm:size-11 ${className}`}
    >
      <Sun className="size-4.5 light:hidden" aria-hidden="true" />
      <Moon className="hidden size-4.5 light:block" aria-hidden="true" />
    </button>
  );
}
