<script lang="ts">
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { AiOutlineGithub } from 'svelte-icons-pack/ai';
  import { FcGoogle } from '$lib/icons';
</script>

<div class="flex w-[350px] flex-col items-center justify-center gap-5 text-center">
  <h2>Continue to MEMshed</h2>
  <div class="w-full space-y-2 *:block *:w-full *:text-base">
    <IconButton
      icon={FcGoogle}
      iconPosition="left"
      variant="outline"
      size="lg"
      href="/auth/signin/google">Continue with Google</IconButton
    >
    <IconButton icon={AiOutlineGithub} iconPosition="left" size="lg" href="/auth/signin/github"
      >Continue with Github</IconButton
    >
  </div>
  <p class="text-sm text-muted-foreground">
    By joining, you agree to our <a>Terms of <br /> Service</a> and <a>Privacy Policy</a>.
  </p>
</div>
