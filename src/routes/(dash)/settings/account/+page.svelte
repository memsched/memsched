<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { IoArrowForward, IoCheckmark, IoKey } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';

  import SettingsTitle from '$lib/components/account/SettingsTitle.svelte';
  import DeleteAccountDialog from '$lib/components/dialogs/DeleteAccountDialog.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Dialog from '$lib/components/ui/dialog';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { FREE_PLAN_LIMITS } from '$lib/constants';
  import { formatCurrency } from '$lib/utils';
  import { cn } from '$lib/utils';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  let subscription = $state(data.subscription);
  let isSubscribed = $derived(
    subscription.status === 'active' || subscription.status === 'trialing'
  );
  let isCanceled = $derived(subscription.cancelAtPeriodEnd);
  let periodEnd = $derived(subscription.currentPeriodEnd);

  $effect(() => {
    subscription = data.subscription;
  });
</script>

<SvelteSeo
  title="Account - MEMsched"
  description="Manage your MEMsched account settings and preferences"
  noindex={true}
  nofollow={true}
/>

<div class="mb-8">
  <SettingsTitle title="Account" subtitle="Manage your subscription and data." icon={IoKey} />
</div>

<div class="space-y-10">
  <!-- Billing Section -->
  <section>
    <div class="mb-4 flex items-center">
      <h2 class="text-2xl font-semibold">Support MEMsched</h2>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Free Plan Card -->
      <Card.Root class={cn('border bg-card', !isSubscribed && 'border-primary')}>
        <Card.Header>
          <div class="flex items-center justify-between">
            <Card.Title>Free Plan</Card.Title>
            {#if !isSubscribed}
              <Badge variant="translucent">Current Plan</Badge>
            {/if}
          </div>
          <Card.Description>Basic features for personal use</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
          <span class="text-2xl font-bold">Free</span>
          <ul class="space-y-2">
            <li class="flex items-center gap-2">
              <Icon src={IoCheckmark} className="size-5 !text-muted-foreground" />
              <span>Up to {FREE_PLAN_LIMITS.maxObjectives} objectives</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon src={IoCheckmark} className="size-5 !text-muted-foreground" />
              <span>Up to {FREE_PLAN_LIMITS.maxWidgets} public widget</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon src={IoCheckmark} className="size-5 !text-muted-foreground" />
              <span>Community support</span>
            </li>
          </ul>
        </Card.Content>
      </Card.Root>

      <!-- Pro Plan Card -->
      <Card.Root
        class={cn(
          'border bg-gradient-to-br from-white to-amber-50',
          isSubscribed && 'border-amber-500'
        )}
      >
        <Card.Header>
          <div class="flex items-center justify-between">
            <Card.Title>MEMsched Pro</Card.Title>
            <Badge variant="secondary" class="bg-amber-100 text-amber-800"
              >☕️ Coffee Supporter</Badge
            >
          </div>
          <Card.Description>Enhanced features with priority support</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div>
            {#await data.price}
              <div class="h-6 w-28 animate-pulse rounded bg-amber-200"></div>
            {:then price}
              <span class="text-2xl font-bold">{formatCurrency(price.amount, price.currency)}</span>
              <span class="text-muted-foreground">/{price.interval}</span>
            {:catch}
              <span class="text-sm text-destructive">Error loading price</span>
            {/await}
          </div>
          <ul class="space-y-2">
            <li class="flex items-center gap-2">
              <Icon src={IoCheckmark} className="size-5 !text-amber-500" />
              <span>Unlimited objectives</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon src={IoCheckmark} className="size-5 !text-amber-500" />
              <span>Full Pro features & premium widgets</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon src={IoCheckmark} className="size-5 !text-amber-500" />
              <span>Priority support from our team</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon src={IoCheckmark} className="size-5 !text-amber-500" />
              <span>Early access to new features</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon src={IoCheckmark} className="size-5 !text-amber-500" />
              <span>Help support active development</span>
            </li>
          </ul>
        </Card.Content>
        <Card.Footer class="flex flex-col gap-2">
          {#if isSubscribed}
            {#if isCanceled}
              <form action="?/subscribe" method="POST" class="w-full">
                <Button
                  type="submit"
                  variant="default"
                  class="w-full"
                  data-umami-event="account-subscribe-button">Subscribe</Button
                >
              </form>
              {#if periodEnd}
                <div class="text-sm text-muted-foreground">
                  Your subscription ends on {new Date(periodEnd).toLocaleDateString()}
                </div>
              {/if}
            {:else}
              <form action="?/manageSubscription" method="POST" class="w-full">
                <IconButton
                  icon={IoArrowForward}
                  type="submit"
                  variant="outline"
                  class="animate-svg w-full"
                  data-umami-event="account-manage-subscription-button"
                >
                  Manage Plan
                </IconButton>
              </form>
            {/if}
          {:else}
            <form action="?/subscribe" method="POST" class="w-full">
              <IconButton
                icon={IoArrowForward}
                type="submit"
                variant="default"
                class="animate-svg w-full bg-amber-800 text-amber-200 hover:bg-amber-700"
                data-umami-event="account-upgrade-to-pro-button"
              >
                Upgrade to Pro
              </IconButton>
            </form>
          {/if}
        </Card.Footer>
      </Card.Root>
    </div>
  </section>

  <!-- Privacy Section -->
  <section>
    <div class="mb-4 flex items-center">
      <h2 class="text-2xl font-semibold">Privacy</h2>
    </div>

    <!-- Delete Account Section -->
    <div class="rounded-lg border border-destructive/20 bg-destructive/5 p-5">
      <div class="flex flex-col gap-6">
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-destructive">Delete Account</h3>
          <div class="space-y-4">
            <p class="max-w-prose text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <div class="text-sm text-muted-foreground">
              <p class="mb-2 font-medium">When you delete your account:</p>
              <ul class="list-inside list-disc space-y-1">
                <li>Your personal information will be anonymized</li>
                <li>Your subscription will be cancelled immediately</li>
                <li>All your objectives and widgets will be deleted</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex">
          <DeleteAccountDialog action="?/deleteAccount" name="userId" value={data.user.id}>
            <Dialog.Trigger>
              {#snippet child({ props })}
                <Button
                  variant="destructive"
                  {...props}
                  data-umami-event="account-delete-account-button">Delete Account</Button
                >
              {/snippet}
            </Dialog.Trigger>
          </DeleteAccountDialog>
        </div>
      </div>
    </div>
  </section>
</div>
