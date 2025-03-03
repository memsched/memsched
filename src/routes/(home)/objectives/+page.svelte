<script lang="ts">
  import CreateNew from '$lib/components/CreateNew.svelte';
  import { IoFolderOpenOutline } from 'svelte-icons-pack/io';
</script>

<div class="flex flex-grow flex-col items-center justify-center">
  <CreateNew
    title="Create your first objective"
    icon={IoFolderOpenOutline}
    href="/objectives/new"
  />
</div>
