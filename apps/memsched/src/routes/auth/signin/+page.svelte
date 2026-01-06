<script lang="ts">
  import { AiOutlineGithub } from 'svelte-icons-pack/ai';
  import SvelteSeo from 'svelte-seo';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { FcGoogle } from '$lib/icons';

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
    url: `${page.url.origin}/auth/signin`,
    type: 'website',
    site_name: 'MEMsched',
  }}
  twitter={{
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  }}
/>

<div class="flex w-[350px] flex-col items-center justify-center gap-5 text-center">
  <h2>Continue to MEMshed</h2>
  <div class="w-full space-y-2 *:block *:w-full *:text-base">
    <IconButton
      data-umami-event="auth-signin-google-button"
      href="/auth/signin/google"
      icon={FcGoogle}
      iconPosition="left"
      size="lg"
      variant="outline">Continue with Google</IconButton
    >
    <IconButton
      class="bg-black hover:bg-zinc-900"
      data-umami-event="auth-signin-github-button"
      href="/auth/signin/github"
      icon={AiOutlineGithub}
      iconPosition="left"
      size="lg">Continue with Github</IconButton
    >
  </div>
  <p class="text-sm text-muted-foreground">
    By joining, you agree to our <a href={resolve('/tos')} aria-label="Terms of Service"
      >Terms of <br /> Service</a
    >
    and
    <a href={resolve('/privacy')} aria-label="Privacy Policy">Privacy Policy</a>.
  </p>
</div>
