<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import type { PageProps } from './$types';
  import { IoKey } from 'svelte-icons-pack/io';
  import SettingsTitle from '$lib/components/account/SettingsTitle.svelte';

  const { data }: PageProps = $props();
</script>

<div class="mb-8">
  <SettingsTitle
    title="Account Settings"
    subtitle="Manage your personal account settings and preferences."
    icon={IoKey}
  />
</div>

<div class="space-y-10">
  <!-- Billing Section -->
  <!-- <section> -->
  <!--   <div class="mb-4 flex items-center"> -->
  <!--     <h2 class="text-2xl font-semibold">Billing</h2> -->
  <!--   </div> -->
  <!---->
  <!--   <div class="space-y-6"> -->
  <!--     <div class="rounded-lg border bg-background p-5"> -->
  <!--       <div class="flex flex-col gap-4"> -->
  <!--         <div class="flex items-center justify-between"> -->
  <!--           <h3 class="h5 font-medium">Current Subscription</h3> -->
  <!--           <Badge variant="secondary">Free Plan</Badge> -->
  <!--         </div> -->
  <!---->
  <!--         <Separator.Root /> -->
  <!---->
  <!--         <div class="grid gap-4 sm:grid-cols-2"> -->
  <!--           <div> -->
  <!--             <p class="mb-2 text-base text-muted-foreground">Included in your plan:</p> -->
  <!--             <ul class="grid gap-1.5 text-sm"> -->
  <!--               <li class="flex items-center gap-1.5"> -->
  <!--                 <Icon src={IoCheckmark} className="size-4" /> -->
  <!--                 <span>Unlimited projects</span> -->
  <!--               </li> -->
  <!--               <li class="flex items-center gap-1.5"> -->
  <!--                 <Icon src={IoCheckmark} className="size-4" /> -->
  <!--                 <span>Up to 3 public widgets</span> -->
  <!--               </li> -->
  <!--               <li class="flex items-center gap-1.5"> -->
  <!--                 <Icon src={IoCheckmark} className="size-4" /> -->
  <!--                 <span>Community support</span> -->
  <!--               </li> -->
  <!--             </ul> -->
  <!--           </div> -->
  <!---->
  <!--           <div class="flex flex-col justify-end"> -->
  <!--             <div class="flex flex-col gap-2 sm:flex-row"> -->
  <!--               <Button variant="default" class="flex-1">Upgrade to Pro</Button> -->
  <!--               <IconButton -->
  <!--                 href="/settings/account/billing" -->
  <!--                 icon={IoArrowForward} -->
  <!--                 variant="outline" -->
  <!--                 class="flex-1" -->
  <!--               > -->
  <!--                 Manage Billing -->
  <!--               </IconButton> -->
  <!--             </div> -->
  <!--           </div> -->
  <!--         </div> -->
  <!--       </div> -->
  <!--     </div> -->

  <!--     <div class="rounded-lg border bg-secondary p-5"> -->
  <!--       <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"> -->
  <!--         <div> -->
  <!--           <div class="mb-1 flex items-center gap-3"> -->
  <!--             <h3 class="h5 font-medium">Pro Plan</h3> -->
  <!--             <Badge>Recommended</Badge> -->
  <!--             <span class="font-medium">$3/month</span> -->
  <!--           </div> -->
  <!--           <p class="text-sm text-muted-foreground"> -->
  <!--             Unlimited widgets, analytics, priority support, and custom integrations -->
  <!--           </p> -->
  <!--         </div> -->
  <!--         <Button variant="default" size="sm" class="whitespace-nowrap">Upgrade Now</Button> -->
  <!--       </div> -->
  <!--     </div> -->
  <!--   </div> -->
  <!-- </section> -->

  <!-- Security Section -->
  <section>
    <div class="mb-4 flex items-center">
      <h2 class="text-2xl font-semibold">Security</h2>
    </div>

    <!-- Delete Account Section -->
    <div class="rounded-lg border border-destructive/20 bg-destructive/5 p-5">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div class="flex-1 space-y-1">
          <h3 class="text-xl font-semibold text-destructive">Delete Account</h3>
          <p class="max-w-prose text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone
            and will remove all your objectives, widgets, and personal information from our system.
          </p>
        </div>
        <ConfirmDeleteDialog action="?/deleteAccount" name="userId" value={data.user.id}>
          <Dialog.Trigger>
            {#snippet child({ props })}
              <Button variant="destructive" {...props}>Delete Account</Button>
            {/snippet}
          </Dialog.Trigger>
        </ConfirmDeleteDialog>
      </div>
    </div>
  </section>
</div>
