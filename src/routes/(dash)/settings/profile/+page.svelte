<script lang="ts">
  import { IoPerson } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';

  import Profile from '$lib/components/account/Profile.svelte';
  import SettingsTitle from '$lib/components/account/SettingsTitle.svelte';
  import ProfileForm from '$lib/components/forms/profile-form/ProfileForm.svelte';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Profile Settings - MEMsched"
  description="Update your profile information on MEMsched"
  noindex={true}
  nofollow={true}
/>

<div class="flex justify-between gap-28">
  <div class="w-full min-w-0">
    <SettingsTitle
      title="Profile Information"
      subtitle="Update your profile information that will be visible to other users."
      icon={IoPerson}
    />
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
