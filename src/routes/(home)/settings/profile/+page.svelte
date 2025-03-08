<script lang="ts">
  import type { PageProps } from './$types';
  import Profile from '$lib/components/account/Profile.svelte';

  const { data }: PageProps = $props();
</script>

<div class="flex justify-between gap-16">
  <div>
    <h2>Public Profile</h2>
  </div>
  <Profile
    username={data.user.username}
    name={data.user.name}
    avatarUrl={data.user.avatarUrl}
    edit
  />
</div>
