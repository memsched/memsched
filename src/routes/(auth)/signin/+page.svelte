<script>
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { AiOutlineGoogle, AiOutlineGithub } from 'svelte-icons-pack/ai';
</script>

<div class="flex w-[350px] flex-col items-center justify-center gap-5 text-center">
  <h2>Log in to MEMshed</h2>
  <div class="w-full space-y-2 *:block *:w-full *:text-base">
    <IconButton icon={AiOutlineGoogle} iconPosition="left" variant="outline" size="lg"
      >Google</IconButton
    >
    <IconButton icon={AiOutlineGithub} iconPosition="left" size="lg">Github</IconButton>
  </div>
  <p class="mt-2">
    Don't have an account? <a href="/signup">Sign up here</a>
  </p>
</div>
