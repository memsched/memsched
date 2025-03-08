<script lang="ts">
  import { browser } from '$app/environment';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import toast from 'svelte-french-toast';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { formSchema, type FormSchema } from './schema';
  import { debounce } from '$lib/utils';
  import { Icon } from 'svelte-icons-pack';
  import { IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'svelte-icons-pack/io';

  interface Props {
    data: { form: SuperValidated<Infer<FormSchema>> };
  }

  const { data }: Props = $props();

  let usernameAlreadyTaken = $state(false);

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    resetForm: false,
    onUpdated({ form }) {
      if (form.message) {
        toast.success(form.message);
      }
    },
  });
  const { form: formData, enhance, errors } = form;

  const {
    delayed,
    submit: submitCheckUsername,
    enhance: usernameEnhance,
  } = superForm(
    { username: $formData.username },
    {
      invalidateAll: false,
      applyAction: false,
      multipleSubmits: 'abort',
      onSubmit({ cancel }) {
        if (!$formData.username) cancel();
        usernameAlreadyTaken = false;
      },
      onUpdated({ form: newForm }) {
        if (newForm.errors.username) {
          usernameAlreadyTaken = true;
          $errors.username = newForm.errors.username;
        }
      },
    }
  );
</script>

<form method="POST" action="?/post" use:enhance class="w-full space-y-8">
  <section class="space-y-6 first:space-y-3">
    <div class="grid grid-cols-2 gap-x-16 gap-y-6">
      <Form.Field {form} name="username">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Username*</Form.Label>
            <div class="relative">
              <Input
                {...props}
                form="check"
                bind:value={$formData.username}
                oninput={debounce(() => submitCheckUsername(), 200)}
              />
              <input type="hidden" name="username" value={$formData.username} />
              {#if $delayed}
                <div class="absolute right-3 top-1/2 -translate-y-1/2">
                  <div
                    class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"
                  ></div>
                </div>
              {:else if ($errors.username || usernameAlreadyTaken) && $formData.username !== data.form.data.username}
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                  <Icon src={IoAlertCircleOutline} className="size-5" />
                </div>
              {:else if !($errors.username || usernameAlreadyTaken) && $formData.username !== data.form.data.username}
                <div class="text-success absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <Icon src={IoCheckmarkCircleOutline} className="size-5" />
                </div>
              {/if}
            </div>
          {/snippet}
        </Form.Control>
        <Form.Description>Your unique username on the platform</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name*</Form.Label>
            <Input {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.Description>Your display name</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="bio" class="col-span-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Bio</Form.Label>
            <Textarea {...props} bind:value={$formData.bio} class="resize-none" />
          {/snippet}
        </Form.Control>
        <Form.Description>Tell others a bit about yourself</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="location">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Location</Form.Label>
            <Input {...props} bind:value={$formData.location} />
          {/snippet}
        </Form.Control>
        <Form.Description>Where you're based</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="website">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Website</Form.Label>
            <Input
              {...props}
              value={$formData.website}
              oninput={(e) => {
                const value = e.currentTarget.value;
                if (value.length > 0) {
                  $formData.website = value;
                } else {
                  $formData.website = null;
                }
              }}
              placeholder="https://"
            />
          {/snippet}
        </Form.Control>
        <Form.Description>Your personal website or social profile</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </section>
  <Form.Button variant="accent">Save Profile</Form.Button>
  {#if browser && import.meta.env.VITE_DEBUG_FORMS === '1' && import.meta.env.DEV}
    <SuperDebug data={$formData} />
  {/if}
</form>

<form id="check" method="POST" action="?/check" use:usernameEnhance class="hidden"></form>
