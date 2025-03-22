<script lang="ts">
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { AiOutlineGithub } from 'svelte-icons-pack/ai';
  import { FcGoogle } from '$lib/icons';
  import SvelteSeo from 'svelte-seo';
  import { DOMAIN } from '$lib/constants';

  const pageTitle = 'Sign in to MEMsched - Track Your Learning Journey';
  const pageDescription =
    'Sign in to MEMsched to track your learning progress, set goals, and showcase your skills with beautiful widgets.';
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${DOMAIN}/auth/signin`,
    type: 'website',
    site_name: 'MEMsched',
  }}
  twitter={{
    card: 'summary',
    site: '@memsched',
    title: pageTitle,
    description: pageDescription,
  }}
/>

<div class="flex w-[350px] flex-col items-center justify-center gap-5 text-center">
  <h2>Continue to MEMshed</h2>
  <div class="w-full space-y-2 *:block *:w-full *:text-base">
    <IconButton
      icon={FcGoogle}
      iconPosition="left"
      variant="outline"
      size="lg"
      href="/auth/signin/google"
      data-umami-event="auth-signin-google-button">Continue with Google</IconButton
    >
    <IconButton
      icon={AiOutlineGithub}
      iconPosition="left"
      size="lg"
      href="/auth/signin/github"
      class="bg-black hover:bg-black/80"
      data-umami-event="auth-signin-github-button">Continue with Github</IconButton
    >
  </div>
  <p class="text-sm text-muted-foreground">
    By joining, you agree to our <a href="/tos">Terms of <br /> Service</a> and
    <a href="/privacy">Privacy Policy</a>.
  </p>
</div>
