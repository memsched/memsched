<script lang="ts">
  import { ICON_URLS } from '$lib/icons';
  import { capitalize } from '$lib/utils';
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
    searchTerms: string; // Lowercase combined terms for faster searching
  };

  let iconIndex: IndexedIcon[] = [];
  let filteredIcons = $state([] as [string, string[]][]);
  let searchInput = '';
  let noResults = $derived(filteredIcons.flatMap(([, icons]) => icons).length === 0);
  let debounceTimer: ReturnType<typeof setTimeout>;

  onMount(() => {
    // Build the search index once on component mount
    iconIndex = Object.entries(ICON_URLS).flatMap(([category, icons]) =>
      Object.entries(icons).map(([name, url]) => ({
        category,
        name,
        url,
        searchTerms: name.toLowerCase(), // Pre-compute lowercase search terms
      }))
    );

    // Initial display of all icons
    updateFilteredIcons(iconIndex);
  });

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
    filteredIcons = Object.entries(groupedResults);
  }

  function searchIcons(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value.toLowerCase();
    searchInput = inputValue;

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
    }, 100); // Small delay for debouncing
  }
</script>

<div class="space-y-2">
  <Input class="w-full" type="text" placeholder="Search" oninput={searchIcons} />
  <div class="max-h-[300px] space-y-4 overflow-y-auto rounded-md border border-gray-200 p-4">
    {#if noResults}
      <small class="text-muted-foreground">No results</small>
    {:else}
      {#each filteredIcons as [category, icons]}
        {#if icons.length > 0}
          <small class="block font-semibold">{capitalize(category)}</small>
          <div class="flex flex-wrap gap-4">
            {#each icons as url}
              <button type="button" class="cursor-pointer" onclick={() => (value = url)}>
                <img src={url} alt="" class="size-8" loading="lazy" />
              </button>
            {/each}
          </div>
        {/if}
      {/each}
    {/if}
  </div>
</div>
