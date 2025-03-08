<script lang="ts">
  import { browser } from '$app/environment';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import toast from 'svelte-french-toast';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { formSchema, type FormSchema } from './schema';

  interface Props {
    data: { form: SuperValidated<Infer<FormSchema>> };
  }

  const { data }: Props = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated({ form }) {
      if (form.message) {
        toast.success(form.message);
      }
    },
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="w-full space-y-8">
  <section class="space-y-6 first:space-y-3">
    <div class="grid grid-cols-2 gap-x-16 gap-y-6">
      <Form.Field {form} name="username">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Username*</Form.Label>
            <Input {...props} bind:value={$formData.username} />
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
            <Textarea {...props} bind:value={$formData.bio} />
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
            <Input {...props} bind:value={$formData.website} placeholder="https://" />
          {/snippet}
        </Form.Control>
        <Form.Description>Your personal website or social profile</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </section>
  <Form.Button>Save Profile</Form.Button>
  {#if browser && import.meta.env.DEV}
    <SuperDebug data={$formData} />
  {/if}
</form>
