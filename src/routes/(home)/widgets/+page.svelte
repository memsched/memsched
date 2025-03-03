<script lang="ts">
  import CreateNew from '$lib/components/CreateNew.svelte';
  import { IoCubeOutline } from 'svelte-icons-pack/io';
</script>

<div class="flex flex-grow flex-col items-center justify-center">
  <CreateNew title="Create your first widget" icon={IoCubeOutline} href="/widgets/new" />
</div>
