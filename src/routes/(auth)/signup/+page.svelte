<script>
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { FcGoogle } from '$lib/icons';
  import { AiOutlineGithub } from 'svelte-icons-pack/ai';
</script>

<div class="flex w-[350px] flex-col items-center justify-center gap-5 text-center">
  <h2>Create your account</h2>
  <div class="w-full space-y-2 *:block *:w-full *:text-base">
    <IconButton
      icon={FcGoogle}
      iconPosition="left"
      variant="outline"
      size="lg"
      href="/signin/google">Sign up with Google</IconButton
    >
    <IconButton icon={AiOutlineGithub} iconPosition="left" size="lg" href="/signin/github"
      >Sign up with Github</IconButton
    >
  </div>
  <p class="text-sm text-muted-foreground">
    By joining, you agree to our <a>Terms of <br /> Service</a> and <a>Privacy Policy</a>.
  </p>
  <p class="mt-2">
    Already have an account? <a href="/signin">Log in here</a>
  </p>
</div>
