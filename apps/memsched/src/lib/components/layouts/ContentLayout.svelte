<script lang="ts">
  import { Logo } from '@memsched/ui/components/svgs';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { IoChevronBack } from 'svelte-icons-pack/io';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<div class="mx-auto flex h-full max-w-screen-md flex-col p-8 lg:px-12 lg:py-16">
  <button
    class="text-muted-foreground hover:text-foreground mb-10 flex items-center gap-0.5 font-bold transition-colors"
    onclick={() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        goto(resolve('/'), { invalidateAll: true });
      }
    }}
  >
    <Icon src={IoChevronBack} className="inline *:!stroke-inherit" />
    Back
  </button>
  <h1 class="mb-4 text-3xl font-bold">{title}</h1>
  <section class="md mb-12 text-justify">
    {@render children()}
  </section>
  <div class="flex w-full justify-center">
    <a href={resolve('/')} aria-label="MEMsched Homepage">
      <Logo />
    </a>
  </div>
</div>
