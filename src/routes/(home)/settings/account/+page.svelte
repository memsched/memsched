<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import DeleteAccountDialog from '$lib/components/dialogs/DeleteAccountDialog.svelte';
  import type { PageProps } from './$types';
  import { IoKey, IoArrowForward } from 'svelte-icons-pack/io';
  import SettingsTitle from '$lib/components/account/SettingsTitle.svelte';
  import SvelteSeo from 'svelte-seo';
  import * as Separator from '$lib/components/ui/separator';
  import { Badge } from '$lib/components/ui/badge';
  import { FREE_PLAN_LIMITS } from '$lib/constants';
  import { formatCurrency } from '$lib/utils';
  import IconButton from '$lib/components/ui/IconButton.svelte';

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
    subtitle="Manage your subscription and data."
    icon={IoKey}
  />
</div>

<div class="space-y-10">
  <!-- Billing Section -->
  <section>
    <div class="mb-4 flex items-center">
      <h2 class="text-2xl font-semibold">Support MEMsched</h2>
    </div>

    <div class="space-y-6">
      <div class="rounded-lg border bg-background p-5">
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h3 class="h5 font-medium">Your Support Level</h3>
            {#if isSubscribed}
              <div class="flex gap-2">
                <Badge variant="secondary" class="bg-amber-100 text-amber-800">
                  {isCanceled ? '☕️ Thanks for the coffee!' : '☕️ Coffee Supporter'}
                </Badge>
                <Badge variant="translucent">MEMsched Pro</Badge>
              </div>
            {:else}
              <Badge variant="secondary">Free Plan</Badge>
            {/if}
          </div>

          <Separator.Root />

          <div class="flex justify-between gap-4 max-lg:flex-col">
            <div>
              <p class="mb-3 text-base text-muted-foreground">What you get:</p>
              <ul class="grid gap-2.5 text-sm">
                {#if isSubscribed}
                  <li class="flex items-center gap-2">
                    <span class="text-amber-500">☕️</span>
                    <span class="whitespace-nowrap"
                      >Unlimited objectives (that's a lot of coffee!)</span
                    >
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-violet-500">⚡️</span>
                    <span class="whitespace-nowrap">Full Pro features & premium widgets</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-amber-500">💝</span>
                    <span class="whitespace-nowrap">Priority support from our team</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-violet-500">🚀</span>
                    <span class="whitespace-nowrap">Early access to new features</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-amber-500">💪</span>
                    <span class="whitespace-nowrap">Help support active development</span>
                  </li>
                {:else}
                  <li class="flex items-center gap-2">
                    <span class="text-zinc-500">☕️</span>
                    <span>Up to {FREE_PLAN_LIMITS.maxObjectives} objectives</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-zinc-500">✨</span>
                    <span>Up to {FREE_PLAN_LIMITS.maxWidgets} public widget</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-zinc-500">💭</span>
                    <span>Community support</span>
                  </li>
                {/if}
              </ul>
            </div>

            <div class="flex flex-col justify-end lg:items-end">
              <div class="mt-2 flex flex-row items-center gap-2">
                {#if isSubscribed}
                  {#if isCanceled}
                    {#if periodEnd}
                      <div class="text-sm text-muted-foreground max-lg:order-3">
                        Your subscription ends on {new Date(periodEnd).toLocaleDateString()}
                      </div>
                    {/if}
                    <form action="?/subscribe" method="POST">
                      <Button type="submit" variant="default" class="flex-1">Subscribe</Button>
                    </form>
                  {:else}
                    <form action="?/cancelSubscription" method="POST">
                      <Button type="submit" variant="outline" class="flex-1">Cancel Plan</Button>
                    </form>
                  {/if}
                  <form action="?/manageSubscription" method="POST">
                    <IconButton
                      icon={IoArrowForward}
                      type="submit"
                      variant="outline"
                      class="animate-svg flex-1"
                    >
                      Manage Plan
                    </IconButton>
                  </form>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>

      {#if !isSubscribed}
        <div class="rounded-lg border bg-gradient-to-br from-white to-amber-100 p-5">
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div class="mb-1 flex items-center gap-3">
                <h3 class="h5 font-medium">MEMsched Pro + Coffee Support</h3>
                <Badge class="bg-amber-200 text-amber-800">2 coffees/month</Badge>
                {#await data.price}
                  <span class="h-6 w-28 animate-pulse rounded bg-amber-200"></span>
                {:then price}
                  <span class="font-medium text-amber-800"
                    >{formatCurrency(price.amount, price.currency)}/{price.interval}</span
                  >
                {:catch}
                  <span class="text-sm text-destructive">Error loading price</span>
                {/await}
              </div>
              <p class="max-w-prose text-sm text-amber-800/80">
                Get MEMsched Pro and support our development with the equivalent of two coffees per
                month! Unlock unlimited access and premium features ✨
              </p>
            </div>
            <form action="?/subscribe" method="POST">
              <IconButton
                icon={IoArrowForward}
                type="submit"
                variant="default"
                size="sm"
                class="animate-svg whitespace-nowrap bg-amber-800 text-amber-200 hover:bg-amber-700"
              >
                Upgrade to Pro
              </IconButton>
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
