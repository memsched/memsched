<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { FiBookOpen, FiHome, FiLifeBuoy, FiLogIn } from 'svelte-icons-pack/fi';

  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { cn } from '$lib/utils';

  import DropdownMenuLabel from '../ui/dropdown-menu/dropdown-menu-label.svelte';
  import DropdownMenuSeparator from '../ui/dropdown-menu/dropdown-menu-separator.svelte';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="flex flex-row items-center justify-center gap-3 border border-transparent"
  >
    <div class="size-8 rounded-full bg-zinc-200"></div>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="min-w-40" align="start" side="right">
    <DropdownMenu.Group>
      <DropdownMenuLabel>
        <div class="leading-3">Anonymous</div>
        <small class="font-normal text-muted-foreground">Currently logged out</small>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenu.Item class="w-full cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a
            {...props}
            href="/auth/signin"
            class={cn(props?.class as string, 'font-semibold text-primary')}
          >
            <Icon src={FiLogIn} className="text-primary" />
            Sign In
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a href="/" {...props} data-sveltekit-reload>
            <Icon src={FiHome} className="!text-muted-foreground" />
            Home
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenuSeparator />
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a href="/docs" {...props} data-sveltekit-reload>
            <Icon src={FiBookOpen} className="!text-muted-foreground" />
            Docs
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a href="mailto:info@memsched.com" {...props}>
            <Icon src={FiLifeBuoy} className="!text-muted-foreground" />
            Support
          </a>
        {/snippet}
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
