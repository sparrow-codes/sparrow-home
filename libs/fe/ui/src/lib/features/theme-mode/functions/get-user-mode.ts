const themeKey: string = 'isDarkMode';

export function getUserMode(): boolean {
  const isDarkMode: string | null = localStorage.getItem(themeKey);

  if (isDarkMode !== null) {
    return isDarkMode === 'true';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function setUserMode(isDarkMode: boolean): void {
  localStorage.setItem(themeKey, String(isDarkMode));
}
