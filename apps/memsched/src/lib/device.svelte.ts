import type { Action } from 'svelte/action';

// Wrap state in an object
export const deviceState = $state({
  isMobile: false,
});

export const initDevice: Action = (_) => {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  // Mutate the property instead of reassigning
  deviceState.isMobile = mediaQuery.matches;

  mediaQuery.addEventListener('change', (event) => {
    // Mutate the property instead of reassigning
    deviceState.isMobile = event.matches;
  });
};
