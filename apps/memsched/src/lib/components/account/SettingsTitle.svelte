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
    class="bg-primary/10 text-primary dark:bg-primary/20 flex size-12 flex-shrink-0 items-center justify-center rounded-full"
  >
    <Icon src={icon} className="size-6" />
  </div>
  <div>
    <h1 class="h2">{title}</h1>
    <p class="text-muted-foreground mt-1">
      {subtitle}
    </p>
  </div>
</div>
