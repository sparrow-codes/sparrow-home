export const LIGHT_THEME_COLOR: string = '#f3f4f6';
export const DARK_THEME_COLOR: string = '#10151c';

const DARK_PALETTE_CLASS: string = 'ion-palette-dark';

/**
 * Syncs the document (Ionic palette class, CSS color-scheme and browser chrome meta tags)
 * with the selected theme, so the status bar / safe area follows a runtime theme toggle.
 */
export function applyThemeToDocument(document: Document, isDarkModeOn: boolean): void {
  const root: HTMLElement = document.documentElement;
  const colorScheme: 'dark' | 'light' = isDarkModeOn ? 'dark' : 'light';

  root.classList.toggle(DARK_PALETTE_CLASS, isDarkModeOn);
  root.style.colorScheme = colorScheme;

  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', colorScheme);

  // iOS Safari does not reliably react to a changed `content` attribute of an already parsed
  // theme-color meta tag, so it is replaced with a fresh element to force a re-read.
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta: Element) => meta.remove());

  const themeColorMeta: HTMLMetaElement = document.createElement('meta');
  themeColorMeta.name = 'theme-color';
  themeColorMeta.content = isDarkModeOn ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;
  document.head.appendChild(themeColorMeta);
}
