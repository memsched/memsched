<script lang="ts">
  import { ThemeToggle } from '@memsched/ui/components/ui';
  import { cn } from '@memsched/ui/utils';
  import { Icon } from 'svelte-icons-pack';
  import { FiBookOpen, FiHome, FiLogIn } from 'svelte-icons-pack/fi';

  import { resolve } from '$app/paths';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

  import DropdownMenuLabel from '../ui/dropdown-menu/dropdown-menu-label.svelte';
  import DropdownMenuSeparator from '../ui/dropdown-menu/dropdown-menu-separator.svelte';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="flex flex-row items-center justify-center gap-3 border border-transparent"
  >
    <div class="grid size-8 place-items-center rounded-full bg-zinc-200 dark:bg-zinc-700">?</div>
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
            href={resolve('/auth/signin')}
            class={cn(props?.class as string, 'font-semibold text-primary')}
            aria-label="Log In"
            data-umami-event="header-profile-anonymous-login-button"
          >
            <Icon src={FiLogIn} className="text-primary" />
            Sign In
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenuSeparator />
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a
            href={resolve('/')}
            {...props}
            aria-label="MEMsched Homepage"
            data-sveltekit-reload
            data-umami-event="header-profile-anonymous-home-button"
          >
            <Icon src={FiHome} className="!text-muted-foreground" />
            Home
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a
            href={resolve('/docs')}
            {...props}
            data-sveltekit-reload
            data-umami-event="header-profile-anonymous-docs-button"
          >
            <Icon src={FiBookOpen} className="!text-muted-foreground" />
            Docs
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenuSeparator />
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <ThemeToggle {...props} />
        {/snippet}
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
