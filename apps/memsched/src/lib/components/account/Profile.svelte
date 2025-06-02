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
  import { Icon } from 'svelte-icons-pack';
  import { FiCamera, FiGlobe, FiMapPin } from 'svelte-icons-pack/fi';

  import { enhance } from '$app/forms';
  import LoadingButton from '$lib/components/ui/LoadingButton.svelte';
  import { updateState } from '$lib/state.svelte';

  import UserAvatar from './UserAvatar.svelte';

  interface Props {
    username: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    edit?: boolean;
  }
  const { name, username, avatarUrl, bio, location, website, edit = false }: Props = $props();

  let fileInput: HTMLInputElement | undefined = $state();

  function handleClick() {
    fileInput?.click();
  }

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const form = input.form;
      if (form) form.requestSubmit();
    }
  }

  let loading = $state(false);
</script>

<div class="sticky top-0 h-fit w-[250px] flex-shrink-0">
  <div class="relative">
    <UserAvatar {username} {avatarUrl} large />
    {#if edit}
      <div class="absolute bottom-2 left-2 size-12 rounded-full border-2 bg-back !p-0"></div>
      <form
        method="POST"
        action="/settings/profile?/updateAvatar"
        enctype="multipart/form-data"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            update();
            updateState.avatarCounter++;
          };
        }}
      >
        <input
          bind:this={fileInput}
          type="file"
          name="avatar"
          accept="image/*"
          class="hidden"
          onchange={handleFileChange}
        />
        <LoadingButton
          type="button"
          onclick={handleClick}
          size="sm"
          class="absolute bottom-2 left-2 size-12 rounded-full border-[3px] border-back !p-0 [&_svg]:size-5"
          variant="translucent"
          {loading}
          icon={FiCamera}
        />
      </form>
    {/if}
  </div>
  <h2 class="mt-8">{name}</h2>
  <p class="text-lg text-muted-foreground">{username}</p>

  {#if bio}
    <p class="mt-5">{bio}</p>
  {/if}

  <div class="mt-4 flex flex-col gap-2">
    {#if location}
      <div class="flex items-center gap-2 text-muted-foreground">
        <Icon src={FiMapPin} className="size-4" />
        <span>{location}</span>
      </div>
    {/if}

    {#if website}
      <div class="flex items-center gap-2 text-muted-foreground">
        <Icon src={FiGlobe} className="size-4" />
        <a href={website} target="_blank" rel="noopener noreferrer" class="hover:underline">
          {website.replace(/^https?:\/\//, '')}
        </a>
      </div>
    {/if}
  </div>
</div>
