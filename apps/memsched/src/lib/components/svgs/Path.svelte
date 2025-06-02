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
  import type { SVGAttributes } from 'svelte/elements';

  const { ...svgProps }: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg
  width="327"
  height="61"
  viewBox="0 0 327 61"
  fill="none"
  stroke="#D9D9D9"
  xmlns="http://www.w3.org/2000/svg"
  {...svgProps}
>
  <path
    d="M1.5 59.9997C119.5 -19 218 -16.9998 326 59.9997"
    stroke-width="2"
    stroke-dasharray="8 8"
  />
</svg>
