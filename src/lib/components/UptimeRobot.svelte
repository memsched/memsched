<script lang="ts">
  import { onMount } from 'svelte';

  import { PUBLIC_UPTIME_ROBOT_ID } from '$env/static/public';

  let isOnline: boolean | null = null;

  async function checkStatus() {
    try {
      const response = await fetch(
        'https://stats.uptimerobot.com/api/getMonitorList/' + PUBLIC_UPTIME_ROBOT_ID
      );
      const data = (await response.json()) as { statistics: { counts: { down: number } } };
      isOnline = data.statistics.counts.down === 0;
    } catch (error) {
      console.error('Error fetching status:', error);
      isOnline = false; // Assume down if request fails
    }
  }

  onMount(checkStatus);
</script>

<a
  href={'https://stats.uptimerobot.com/' + PUBLIC_UPTIME_ROBOT_ID}
  target="_blank"
  class="mt-2 inline-flex items-center space-x-1"
>
  <span class="relative me-1 inline-flex h-2.5 w-2.5">
    <span
      class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
      class:!bg-green-400={isOnline}
      class:!bg-red-400={isOnline === false}
      class:!bg-muted-foreground={isOnline === null}
    ></span>
    <span
      class="relative inline-flex h-2.5 w-2.5 rounded-full"
      class:!bg-green-500={isOnline}
      class:!bg-red-500={isOnline === false}
      class:!bg-muted-foreground={isOnline === null}
    ></span>
  </span>
  <p class="text-muted-foreground transition-colors hover:text-foreground">
    {isOnline === null
      ? 'Checking...'
      : isOnline
        ? 'All services are online'
        : 'Some services are down'}
  </p>
</a>
