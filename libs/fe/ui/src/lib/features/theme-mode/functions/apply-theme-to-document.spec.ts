import { applyThemeToDocument, DARK_THEME_COLOR, LIGHT_THEME_COLOR } from './apply-theme-to-document';

describe('applyThemeToDocument', () => {
  beforeEach(() => {
    document.head.innerHTML = `
      <meta name="color-scheme" content="light" />
      <meta name="theme-color" content="${LIGHT_THEME_COLOR}" />
    `;
    document.documentElement.className = '';
    document.documentElement.style.colorScheme = '';
  });

  function themeColorMetas(): HTMLMetaElement[] {
    return Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'));
  }

  it('applies the dark theme and replaces the theme-color meta element', () => {
    const originalMeta: HTMLMetaElement = themeColorMetas()[0];

    applyThemeToDocument(document, true);

    const metas: HTMLMetaElement[] = themeColorMetas();
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(document.querySelector('meta[name="color-scheme"]')?.getAttribute('content')).toBe('dark');
    expect(metas).toHaveLength(1);
    expect(metas[0].content).toBe(DARK_THEME_COLOR);
    expect(metas[0]).not.toBe(originalMeta);
  });

  it('applies the light theme after the dark theme', () => {
    applyThemeToDocument(document, true);
    applyThemeToDocument(document, false);

    const metas: HTMLMetaElement[] = themeColorMetas();
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(document.querySelector('meta[name="color-scheme"]')?.getAttribute('content')).toBe('light');
    expect(metas).toHaveLength(1);
    expect(metas[0].content).toBe(LIGHT_THEME_COLOR);
  });

  it('creates the theme-color meta when it is missing', () => {
    document.head.innerHTML = '';

    applyThemeToDocument(document, true);

    expect(themeColorMetas().map((meta: HTMLMetaElement) => meta.content)).toEqual([DARK_THEME_COLOR]);
  });
});
