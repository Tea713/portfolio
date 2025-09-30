import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function createThemeStore() {
	// Check localStorage first, then system preference, default to dark
	const getInitialTheme = (): Theme => {
		if (!browser) return 'dark';

		const stored = localStorage.getItem('theme') as Theme | null;
		if (stored) return stored;

		// Check system preference
		if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			return 'light';
		}

		return 'dark';
	};

	const { subscribe, set, update } = writable<Theme>(getInitialTheme());

	return {
		subscribe,
		toggle: () => {
			update((current) => {
				const newTheme = current === 'dark' ? 'light' : 'dark';
				if (browser) {
					localStorage.setItem('theme', newTheme);
				}
				return newTheme;
			});
		},
		set: (value: Theme) => {
			if (browser) {
				localStorage.setItem('theme', value);
			}
			set(value);
		}
	};
}

export const theme = createThemeStore();
