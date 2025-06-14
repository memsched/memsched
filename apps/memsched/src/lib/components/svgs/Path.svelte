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
