<script lang="ts">
  import { IoWarning } from 'svelte-icons-pack/io';
  import { Icon } from 'svelte-icons-pack';
</script>

<div class="relative w-full bg-amber-400 px-4 py-2 text-center dark:bg-amber-500">
  <div class="mx-auto flex max-w-7xl items-center justify-center gap-2">
    <Icon src={IoWarning} size={24} className="fill-amber-900 dark:fill-amber-950" />
    <p class="font-medium text-amber-900 dark:text-amber-950">
      This site is under construction. Some features may not be available yet.
    </p>
  </div>
</div>
