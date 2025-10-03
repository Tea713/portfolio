import { writable } from "svelte/store";

type Section = 'about' | 'projects' | 'shop';

function createNavigationStore() {
  const { subscribe, set } = writable<Section>('about');
  
  return {
    subscribe,
    navigateTo: (section: Section) => set(section)
  };
}

export const currentSection = createNavigationStore();
