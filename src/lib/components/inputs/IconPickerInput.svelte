<script lang="ts">
  import { ICON_URLS } from '$lib/icons';
  import { Input } from '../ui/input';
  import { onMount } from 'svelte';

  interface Props {
    value: string | null;
  }
  let { value = $bindable() }: Props = $props();

  // Create search index
  type IndexedIcon = {
    category: string;
    name: string;
    url: string;
    searchTerms: string;
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

  onMount(() => {
    // Build the search index once on component mount
    iconIndex = Object.entries(ICON_URLS).flatMap(([category, icons]) =>
      Object.entries(icons).map(([name, url]) => ({
        category,
        name,
        url,
        searchTerms: name.toLowerCase(),
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

      // Filter the index
      const filtered = iconIndex.filter((icon) => icon.searchTerms.includes(inputValue));
      updateFilteredIcons(filtered);
    }, 100);
  }
</script>

<div class="space-y-2">
  <Input class="w-full" type="text" placeholder="Search" oninput={searchIcons} />
  <div
    class="max-h-[300px] space-y-4 overflow-y-auto rounded-md border border-gray-200 bg-background p-4"
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
              <button type="button" class="cursor-pointer" onclick={() => (value = url)}>
                <img src={url} alt="" class="size-8" loading="lazy" />
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
