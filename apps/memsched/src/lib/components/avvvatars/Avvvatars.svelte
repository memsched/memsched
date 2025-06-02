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
  import { BACKGROUND_COLORS, SHAPE_COLORS, TEXT_COLORS } from './lib/colors';
  import randiman from './lib/random';
  import Shape from './shape/Shape.svelte';

  const DEFAULTS = {
    style: 'character',
    size: 32,
    shadow: false,
    border: false,
    borderSize: 2,
    borderColor: '#fff',
  };

  interface Props {
    class?: string;
    displayValue?: any;
    value: any;
    size?: any;
    shadow?: any;
    style?: any;
    border?: any;
    borderSize?: any;
    borderColor?: any;
    radius?: any;
  }

  let {
    class: className = '',
    displayValue = null,
    value,
    size = DEFAULTS.size,
    shadow = DEFAULTS.shadow,
    style = DEFAULTS.style,
    border = DEFAULTS.border,
    borderSize = DEFAULTS.borderSize,
    borderColor = DEFAULTS.borderColor,
    radius = null,
  }: Props = $props();

  let name = String(displayValue || value).substring(0, 2);
  let key = randiman({ value, min: 0, max: 19 });
  let shapeKey = randiman({ value, min: 1, max: 60 });
</script>

<div
  class="wrapper {className}"
  style="
    width: {size}px;
    height: {size}px;
    border-radius: {radius || size}px;
    background-color: #{BACKGROUND_COLORS[key]};
    {border ? `border: ${borderSize}px solid ${borderColor};` : ''}
    {shadow
    ? 'box-shadow: 0px 3px 8px rgba(18, 18, 18, 0.04), 0px 1px 1px rgba(18, 18, 18, 0.02);'
    : ''}
  "
>
  {#if style === 'character'}
    <p
      class="text"
      style="
        font-size: {Math.round((size / 100) * 37)}px;
        color: #{TEXT_COLORS[key]};
      "
    >
      {name}
    </p>
  {:else}
    <Shape
      name={`Shape${shapeKey}`}
      color={SHAPE_COLORS[key]}
      size={Math.round((size / 100) * 50)}
    />
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

  .text {
    margin: 0;
    padding: 0;
    text-align: center;
    line-height: 0;
    text-transform: uppercase;
    font-weight: 500;
  }

  .wrapper:hover {
    z-index: 3;
  }
</style>
