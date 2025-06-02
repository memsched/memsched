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
  import { Logo } from '@memsched/ui/components/svgs';

  import { HEADER_HEIGHT } from '$lib/constants';

  import { Button } from '../ui/button';
</script>

<header class="w-full">
  <nav style:height="{HEADER_HEIGHT}px" class="main-container flex items-center justify-between">
    <a href="/" aria-label="MEMsched Homepage">
      <Logo />
    </a>
    <div class="flex gap-3">
      <Button href="mailto:info@memsched.com" size="sm" variant="translucent">Contact</Button>
    </div>
  </nav>
</header>
