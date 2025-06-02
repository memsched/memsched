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
  import { IoArrowForward } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';
  import { v4 as uuid4 } from 'uuid';

  import { page } from '$app/state';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import ShareWidget from '$lib/components/ShareWidget.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
</script>

<SvelteSeo
  title="Share Your Widget - MEMsched"
  description="Share your learning progress widget with others"
  noindex={true}
  nofollow={true}
/>

<HomeLayout class="w-[80%] items-center justify-center gap-6">
  <div class="w-full space-y-2 text-center">
    <h2>Share your new widget</h2>
    <p class="text-sm">You can always get the sharing info when editing the widget.</p>
  </div>
  <div class="flex gap-5">
    <img
      src="/api/widgets/{page.params.id}?f=svg&v={uuid4()}"
      alt="Widget Preview"
      class="h-[100px] object-contain object-left"
      loading="eager"
    />
    <div class="space-y-4">
      <ShareWidget
        title={data.widget.title}
        subtitle={data.widget.subtitle}
        username={data.user.username}
      />
      <IconButton icon={IoArrowForward} href="/widgets" class="animate-svg"
        >Return to Widgets</IconButton
      >
    </div>
  </div>
</HomeLayout>
