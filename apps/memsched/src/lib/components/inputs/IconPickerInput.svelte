<!--
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
-->
<script lang="ts">
  import { onMount } from 'svelte';

  import { page } from '$app/state';
  import { ICON_URLS } from '$lib/icons';

  import { Input } from '../ui/input';

  interface Props {
    value: string | null;
  }
  let { value = $bindable() }: Props = $props();

  const origin = page.url.origin;

  // Create search index
  type IndexedIcon = {
    category: string;
    name: string;
    url: string;
    searchTerms: string[];
  };

  let iconIndex: IndexedIcon[] = [];
  let allFilteredIcons = $state([] as [string, string[]][]);
  let visibleFilteredIcons = $state([] as [string, string[]][]);
  let noResults = $derived(allFilteredIcons.flatMap(([, icons]) => icons).length === 0);
  let debounceTimer: ReturnType<typeof setTimeout>;

  // Infinite scroll parameters
  const ICONS_PER_PAGE = 100;
  let currentPage = $state(1);
  let containerRef: HTMLDivElement;
  let isLoading = $state(false);
  let hasMoreIcons = $state(true);

  /**
   * Generate search terms from an icon name by splitting on underscores and dashes
   */
  function generateSearchTerms(name: string): string[] {
    const lowerName = name.toLowerCase();
    // Include the original name as one of the search terms
    const terms = [lowerName];

    // Split by common word separators and add individual words
    const words = lowerName.split(/[_\-\s]+/).filter((word) => word);
    terms.push(...words);

    // Remove duplicates
    return [...new Set(terms)];
  }

  onMount(() => {
    // Build the search index once on component mount
    iconIndex = Object.entries(ICON_URLS).flatMap(([category, icons]) =>
      Object.entries(icons).map(([name, url]) => ({
        category,
        name,
        url,
        searchTerms: generateSearchTerms(name),
      }))
    );

    // Initial display of icons
    updateFilteredIcons(iconIndex);

    // Use a scroll event handler instead of Intersection Observer
    // This allows us to trigger loading earlier in the scroll
    containerRef.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.removeEventListener('scroll', handleScroll);
    };
  });

  function handleScroll() {
    if (!hasMoreIcons || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef;

    // Instead of using a percentage, we'll use a fixed pixel distance from the bottom
    // This ensures we always preload when the user is a consistent distance from the end
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const preloadThreshold = 300; // Start loading when within 200px of the bottom

    if (distanceFromBottom < preloadThreshold) {
      loadMoreIcons();
    }
  }

  function updateFilteredIcons(filtered: IndexedIcon[]) {
    // Group by category
    const groupedResults = filtered.reduce(
      (acc, icon) => {
        if (!acc[icon.category]) {
          acc[icon.category] = [];
        }
        acc[icon.category].push(icon.url);
        return acc;
      },
      {} as Record<string, string[]>
    );

    // Convert to the format your UI expects
    allFilteredIcons = Object.entries(groupedResults);

    // Reset pagination
    currentPage = 1;
    hasMoreIcons = true;

    // Load first batch
    visibleFilteredIcons = paginateIcons(allFilteredIcons, currentPage, ICONS_PER_PAGE);
  }

  function paginateIcons(
    icons: [string, string[]][],
    page: number,
    perPage: number
  ): [string, string[]][] {
    // Create a flattened list of all [category, url] pairs
    const flatList = icons.flatMap(
      ([category, urls]) => urls.map((url) => [category, url]) as [string, string][]
    );

    // Calculate pagination
    const startIdx = 0;
    const endIdx = page * perPage;
    const paginatedFlat = flatList.slice(startIdx, endIdx);

    // No more icons to load
    if (endIdx >= flatList.length) {
      hasMoreIcons = false;
    }

    // Re-group by category
    const result = paginatedFlat.reduce(
      (acc, [category, url]) => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(url);
        return acc;
      },
      {} as Record<string, string[]>
    );

    return Object.entries(result);
  }

  function loadMoreIcons() {
    if (!hasMoreIcons || isLoading) return;
    isLoading = true;

    // Reduced delay for preloading
    setTimeout(() => {
      currentPage++;
      visibleFilteredIcons = paginateIcons(allFilteredIcons, currentPage, ICONS_PER_PAGE);
      isLoading = false;
    }, 100);
  }

  function searchIcons(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value.toLowerCase();

    // Debounce the search to prevent excessive rendering
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!inputValue.trim()) {
        // If search is empty, show all icons
        updateFilteredIcons(iconIndex);
        return;
      }

      // Split search input to match against individual words
      const searchTerms = inputValue.split(/\s+/).filter((term) => term);

      // Filter the index - match if ANY search term matches ANY icon term
      const filtered = iconIndex.filter((icon) => {
        return searchTerms.some((searchTerm) =>
          icon.searchTerms.some((iconTerm) => iconTerm.includes(searchTerm))
        );
      });

      updateFilteredIcons(filtered);
    }, 100);
  }
</script>

<div class="space-y-2">
  <Input class="w-full" type="text" placeholder="Search" oninput={searchIcons} />
  <div
    class="max-h-[300px] space-y-4 overflow-y-auto rounded-md border bg-background p-4"
    bind:this={containerRef}
  >
    {#if noResults}
      <small class="text-muted-foreground">No results</small>
    {:else}
      {#each visibleFilteredIcons as [category, icons]}
        {#if icons.length > 0}
          <small class="block font-semibold capitalize">{category}</small>
          <div class="flex flex-wrap gap-4">
            {#each icons as url}
              <button type="button" class="cursor-pointer" onclick={() => (value = origin + url)}>
                <img src={origin + url} alt="" class="size-8" loading="lazy" />
              </button>
            {/each}
          </div>
        {/if}
      {/each}

      {#if isLoading}
        <div class="flex justify-center py-2">
          <small class="text-muted-foreground">Loading more icons...</small>
        </div>
      {/if}
    {/if}
  </div>
</div>
