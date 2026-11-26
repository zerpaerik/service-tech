export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'mandaito-theme';

/**
 * Se ejecuta en <head> antes de pintar: aplica el tema guardado o, si no hay,
 * el del sistema operativo. Evita el destello de un tema equivocado al cargar.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){}})()`;

/** Color de la barra del navegador en móviles para cada tema. */
export const themeColors: Record<Theme, string> = {
  dark: '#0a0b14',
  light: '#f6f6fa',
};
