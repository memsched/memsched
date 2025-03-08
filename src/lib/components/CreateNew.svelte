<script lang="ts">
  import { Icon, type IconType } from 'svelte-icons-pack';
  import IconButton from './ui/IconButton.svelte';
  import { IoAdd } from 'svelte-icons-pack/io';
  import { page } from '$app/state';

  interface Props {
    title: string;
    icon: IconType;
    href: string;
  }

  const { icon, title, href }: Props = $props();
  const finalHref = page.data.user === null ? '/auth/signin' : href;
</script>

<Icon src={icon} size="185" className="*:!stroke-[5px]" />
<h2 class="mt-2">{title}</h2>
<IconButton icon={IoAdd} size="lg" class="mt-6 text-base" href={finalHref}>Create</IconButton>
