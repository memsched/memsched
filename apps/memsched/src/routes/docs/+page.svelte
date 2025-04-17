<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  const pageTitle = 'Documentation - MEMsched';
  const pageDescription =
    'Everything you need to know about creating, customizing, and embedding MEMsched widgets. Learn how to track and showcase your learning journey.';
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    type: 'website',
  }}
  twitter={{
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  }}
/>

<div class="space-y-12">
  <!-- Hero section -->
  <div class="space-y-4 border-b pb-8">
    <h1 class="scroll-m-20 text-4xl font-bold tracking-tight text-foreground">Documentation</h1>
    <p class="max-w-2xl text-xl text-muted-foreground">
      Everything you need to know about creating, customizing, and embedding MEMsched widgets.
    </p>
  </div>

  <!-- Introduction section -->
  <div class="space-y-6">
    <div class="space-y-4">
      <h2 class="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight text-foreground">
        What is MEMsched?
      </h2>
      <p class="leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
        MEMsched is a platform that helps you track and showcase your learning journey through
        beautiful, customizable widgets. Whether you're learning to code, studying a new language,
        or developing any other skill, MEMsched helps you stay motivated and share your progress
        with the world.
      </p>
    </div>

    <div class="space-y-4">
      <h2 class="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight text-foreground">
        Key Features
      </h2>
      <ul class="list-none space-y-3 text-muted-foreground">
        <li class="flex items-center gap-2">
          <div class="size-1.5 rounded-full bg-primary/50"></div>
          Create beautiful progress tracking widgets
        </li>
        <li class="flex items-center gap-2">
          <div class="size-1.5 rounded-full bg-primary/50"></div>
          Customize colors, styles, and metrics
        </li>
        <li class="flex items-center gap-2">
          <div class="size-1.5 rounded-full bg-primary/50"></div>
          Embed widgets anywhere on the web
        </li>
        <li class="flex items-center gap-2">
          <div class="size-1.5 rounded-full bg-primary/50"></div>
          Track multiple learning objectives
        </li>
        <li class="flex items-center gap-2">
          <div class="size-1.5 rounded-full bg-primary/50"></div>
          Share your progress with the community
        </li>
      </ul>
    </div>
  </div>
</div>
