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

  interface Props {
    title: string;
    subtitle: string;
    icon: IconType;
  }

  const { title, subtitle, icon }: Props = $props();
</script>

<div class="mb-10 flex items-center gap-4">
  <div
    class="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20"
  >
    <Icon src={icon} className="size-6" />
  </div>
  <div>
    <h1 class="h2">{title}</h1>
    <p class="mt-1 text-muted-foreground">
      {subtitle}
    </p>
  </div>
</div>
