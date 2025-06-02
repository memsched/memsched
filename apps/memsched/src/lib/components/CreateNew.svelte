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
  import { Icon, type IconType } from 'svelte-icons-pack';
  import { FiPlus } from 'svelte-icons-pack/fi';

  import { page } from '$app/state';

  import IconButton from './ui/IconButton.svelte';

  interface Props {
    title: string;
    description?: string;
    icon: IconType;
    href: string;
    buttonText?: string;
    buttonIcon?: IconType;
  }

  const {
    icon,
    title,
    href,
    description,
    buttonText = 'Create Now',
    buttonIcon = FiPlus,
  }: Props = $props();
  const finalHref = page.data.user === null ? '/auth/signin' : href;
</script>

<div class="flex flex-col items-center justify-center gap-4">
  <div class="flex h-48 w-48 items-center justify-center rounded-full bg-primary/10">
    <Icon src={icon} size="150" className="*:!stroke-[5px] !text-primary" />
  </div>

  <h1 class="h3 max-w-sm text-center">{title}</h1>
  {#if description}
    <p class="max-w-sm text-center text-muted-foreground">{description}</p>
  {/if}
  <div class="text-center">
    <IconButton icon={buttonIcon} size="lg" href={finalHref}>{buttonText}</IconButton>
    <p class="mt-2 text-xs text-muted-foreground">
      {#if page.data.user === null}
        Sign in to get started
      {:else}
        Click to begin
      {/if}
    </p>
  </div>
</div>
