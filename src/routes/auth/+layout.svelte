<script lang="ts">
  import AuthLayout from '$lib/components/layouts/AuthLayout.svelte';

  const { children } = $props();
</script>

<AuthLayout>
  {@render children()}
</AuthLayout>
