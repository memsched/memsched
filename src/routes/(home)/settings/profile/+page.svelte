<script lang="ts">
  import type { PageProps } from './$types';
  import Profile from '$lib/components/account/Profile.svelte';
  import ProfileForm from '$lib/components/forms/profile-form/ProfileForm.svelte';

  const { data }: PageProps = $props();
</script>

<div class="flex justify-between gap-28">
  <div class="w-full min-w-0">
    <h2>Profile Information</h2>
    <p class="mb-10 mt-2 text-muted-foreground">
      Update your profile information that will be visible to other users.
    </p>
    <ProfileForm {data} />
  </div>
  <Profile
    username={data.user.username}
    name={data.user.name}
    avatarUrl={data.user.avatarUrl}
    bio={data.user.bio}
    location={data.user.location}
    website={data.user.website}
    edit
  />
</div>
