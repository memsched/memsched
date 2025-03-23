<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import DeleteAccountDialog from '$lib/components/dialogs/DeleteAccountDialog.svelte';
  import type { PageProps } from './$types';
  import { IoKey } from 'svelte-icons-pack/io';
  import SettingsTitle from '$lib/components/account/SettingsTitle.svelte';
  import SvelteSeo from 'svelte-seo';
  import * as Separator from '$lib/components/ui/separator';
  import { Badge } from '$lib/components/ui/badge';
  import { FREE_PLAN_LIMITS } from '$lib/constants';

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
  title="Account Settings - MEMsched"
  description="Manage your MEMsched account settings and preferences"
  noindex={true}
  nofollow={true}
/>

<div class="mb-8">
  <SettingsTitle
    title="Account Settings"
    subtitle="Manage your personal account settings and preferences."
    icon={IoKey}
  />
</div>

<div class="space-y-10">
  <!-- Billing Section -->
  <section>
    <div class="mb-4 flex items-center">
      <h2 class="text-2xl font-semibold">Billing</h2>
    </div>

    <div class="space-y-6">
      <div class="rounded-lg border bg-background p-5">
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h3 class="h5 font-medium">Current Subscription</h3>
            {#if isSubscribed}
              <Badge variant="secondary">
                {isCanceled ? 'Canceling' : 'Pro Plan'}
              </Badge>
            {:else}
              <Badge variant="secondary">Free Plan</Badge>
            {/if}
          </div>

          <Separator.Root />

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="mb-2 text-base text-muted-foreground">Included in your plan:</p>
              <ul class="grid gap-1.5 text-sm">
                {#if isSubscribed}
                  <li class="flex items-center gap-1.5">
                    <span class="text-lg">✓</span>
                    <span>Unlimited objectives</span>
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="text-lg">✓</span>
                    <span>Unlimited public widgets</span>
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="text-lg">✓</span>
                    <span>Priority support</span>
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="text-lg">✓</span>
                    <span>Custom integrations</span>
                  </li>
                {:else}
                  <li class="flex items-center gap-1.5">
                    <span class="text-lg">✓</span>
                    <span>Up to {FREE_PLAN_LIMITS.maxObjectives} objectives</span>
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="text-lg">✓</span>
                    <span>Up to {FREE_PLAN_LIMITS.maxWidgets} public widget</span>
                  </li>
                  <li class="flex items-center gap-1.5">
                    <span class="text-lg">✓</span>
                    <span>Community support</span>
                  </li>
                {/if}
              </ul>
            </div>

            <div class="flex flex-col items-end justify-end">
              <div class="flex flex-col gap-2 sm:flex-row">
                {#if isSubscribed}
                  {#if isCanceled}
                    {#if periodEnd}
                      <div class="text-sm text-muted-foreground">
                        Your subscription will end on {new Date(periodEnd).toLocaleDateString()}
                      </div>
                    {/if}
                    <form action="?/subscribe" method="POST">
                      <Button type="submit" variant="default" class="flex-1">Resubscribe</Button>
                    </form>
                  {:else}
                    <form action="?/cancelSubscription" method="POST">
                      <Button type="submit" variant="outline" class="flex-1">Cancel Plan</Button>
                    </form>
                  {/if}
                  <form action="?/manageSubscription" method="POST">
                    <Button type="submit" variant="outline" class="flex-1">Manage Billing</Button>
                  </form>
                {:else}
                  <form action="?/subscribe" method="POST">
                    <Button type="submit" variant="default" class="flex-1">Upgrade to Pro</Button>
                  </form>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>

      {#if !isSubscribed}
        <div class="rounded-lg border bg-secondary p-5">
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div class="mb-1 flex items-center gap-3">
                <h3 class="h5 font-medium">Pro Plan</h3>
                <Badge>Recommended</Badge>
                <span class="font-medium">$3/month</span>
              </div>
              <p class="text-sm text-muted-foreground">
                Unlimited objectives & widgets, priority support, and custom integrations
              </p>
            </div>
            <form action="?/subscribe" method="POST">
              <Button type="submit" variant="default" size="sm" class="whitespace-nowrap">
                Upgrade Now
              </Button>
            </form>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <!-- Security Section -->
  <section>
    <div class="mb-4 flex items-center">
      <h2 class="text-2xl font-semibold">Security</h2>
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
                <li>Your data will be retained for 30 days for legal purposes</li>
                <li>After 30 days, all data will be permanently deleted</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex">
          <DeleteAccountDialog action="?/deleteAccount" name="userId" value={data.user.id}>
            <Dialog.Trigger>
              {#snippet child({ props })}
                <Button variant="destructive" {...props}>Delete Account</Button>
              {/snippet}
            </Dialog.Trigger>
          </DeleteAccountDialog>
        </div>
      </div>
    </div>
  </section>
</div>
