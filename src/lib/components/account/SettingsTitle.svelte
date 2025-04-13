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
    class="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20"
  >
    <Icon src={icon} className="size-6" />
  </div>
  <div>
    <h1 class="h2">{title}</h1>
    <p class=" mt-1 text-muted-foreground">
      {subtitle}
    </p>
  </div>
</div>
