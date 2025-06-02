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
  import SvelteSeo from 'svelte-seo';

  import WidgetForm from '$lib/components/forms/widget-form/WidgetForm.svelte';

  import type { PageProps } from './$types';

  const { data, form }: PageProps = $props();

  $effect(() => {
    if (form?.error) {
      toast.error(form.error);
    }
  });
</script>

<SvelteSeo
  title="Edit Widget - MEMsched"
  description="Edit your learning progress widget on MEMsched"
  noindex={true}
  nofollow={true}
/>

<WidgetForm {data} edit />
