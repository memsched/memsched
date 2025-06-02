/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
