<!--
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import { toast } from 'svelte-french-toast';
  import { IoPerson } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';

  import Profile from '$lib/components/account/Profile.svelte';
  import SettingsTitle from '$lib/components/account/SettingsTitle.svelte';
  import ProfileForm from '$lib/components/forms/profile-form/ProfileForm.svelte';

  import type { PageProps } from './$types';

  const { data, form }: PageProps = $props();

  // Show toast message when form action completes successfully
  $effect(() => {
    if (form?.success && form?.message) {
      toast.success(form.message);
    }
    if (form?.error) {
      toast.error(form.error);
    }
  });
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
