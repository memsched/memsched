<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { IoCode } from 'svelte-icons-pack/io';
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

  <!-- Quick links grid -->
  <div class="grid gap-6 sm:grid-cols-2">
    <a
      class="group relative rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
      href="/docs/embedding/html"
    >
      <div class="mb-3 flex items-center gap-3">
        <div class="rounded-md bg-primary/10 p-2 text-primary">
          <Icon className="size-5" src={IoCode} />
        </div>
        <h2 class="h3">Embedding Guide</h2>
      </div>
      <p class="text-sm text-muted-foreground">
        Learn how to embed your widgets in various platforms.
      </p>
      <div class="absolute bottom-3 right-4 opacity-0 transition-opacity group-hover:opacity-100">
        <span class="text-sm text-primary">Learn more →</span>
      </div>
    </a>

    <a
      class="group relative rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
      href="/docs/customization/styling"
    >
      <div class="mb-3 flex items-center gap-3">
        <div class="rounded-md bg-primary/10 p-2 text-primary">
          <Icon className="size-5" src={IoCode} />
        </div>
        <h2 class="h3">Customization</h2>
      </div>
      <p class="text-sm text-muted-foreground">
        Learn how to customize the appearance of your widgets.
      </p>
      <div class="absolute bottom-3 right-4 opacity-0 transition-opacity group-hover:opacity-100">
        <span class="text-sm text-primary">Learn more →</span>
      </div>
    </a>
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
