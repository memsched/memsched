<script lang="ts">
  import { mode } from 'mode-watcher';
  import { onMount } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { IoArrowForward, IoCube, IoGlobe, IoPersonCircle } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';

  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import Arrow from '$lib/components/svgs/Arrow.svelte';
  import Path from '$lib/components/svgs/Path.svelte';
  import * as Accordion from '$lib/components/ui/accordion';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import Widget from '$lib/components/widgets/Widget.svelte';
  import { HEADER_HEIGHT } from '$lib/constants';
  import { FLAT_COLOR_ICONS } from '$lib/icons';
  import { mockWidgets } from '$lib/widgets';

  const codeSnippet = `
<img src="https://memsched.com/api/widgets/example?f=svg" />`;

  let liveIncrement = $state(0);
  let livePoints = $state([{ y: 0 }]);

  onMount(() => {
    const updateData = () => {
      let newValue = Math.floor(Math.random() * 100) + 5;
      liveIncrement += Math.floor(newValue / 10);
      livePoints.push({ y: liveIncrement + newValue });
      livePoints = livePoints.slice(-14);

      // Schedule next update with a new random interval
      setTimeout(updateData, Math.floor(Math.random() * 2000) + 500);
    };

    // Start the first update
    updateData();
  });

  const pageTitle = "MEMsched - Show the world what you're learning";
  const pageDescription =
    'Set goals, log progress, and showcase your learning journey with beautiful widgets. Track your skills development and share your achievements.';
  const imageAlt = 'MEMsched - Track and showcase your learning journey';
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  canonical={page.url.origin}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: page.url.origin,
    type: 'website',
    site_name: 'MEMsched - Learning Progress Tracker',
    images: [
      {
        url: `${page.url.origin}/opengraph.png`,
        width: 1200,
        height: 630,
        alt: imageAlt,
      },
    ],
  }}
  twitter={{
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    image: `${page.url.origin}/opengraph.png`,
    imageAlt: imageAlt,
  }}
/>

<HomeLayout class="*:py-20" container={false}>
  <section
    id="hero"
    style:height="calc(100vh - {HEADER_HEIGHT}px)"
    class="bg-dotted-fade flex h-full max-h-[900px] flex-col items-center justify-between !pb-0 text-center"
  >
    <div class="main-container flex flex-col items-center justify-center gap-8 py-20">
      <div class="space-y-3">
        <Badge class="text-sm" variant="translucent">v2 Released 🎉</Badge>
        <h1>Show the world what you're <span class="text-primary">learning.</span></h1>
        <h2
          class="h4 bg-gradient-to-r from-zinc-400 to-zinc-500 bg-clip-text font-medium text-transparent"
        >
          Set measurable goals, log daily progress, and showcase your journey with embeddable
          widgets.
        </h2>
      </div>
      <div class="relative w-fit">
        <div class="flex items-center gap-2">
          <a
            href="https://www.producthunt.com/posts/memsched?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-memsched"
            target="_blank"
            rel="noreferrer noopener"
            ><img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=955665&theme=neutral&t=1745314792465"
              alt="MEMsched - Show&#0032;the&#0032;world&#0032;what&#0032;you&#0039;re&#0032;learning&#0032;and&#0032;embed&#0032;on&#0032;any&#0032;site | Product Hunt"
              style="width: 250px; height: 54px;"
              width="250"
              height="54"
            /></a
          >
          <Button data-umami-event="hero-get-started-button" href="/auth/signin" size="cta"
            >Start Your Journey for Free</Button
          >
        </div>
        <Arrow class="absolute left-[105%] top-[60%] rotate-6" />
      </div>
    </div>
    {#if browser}
      {#await import('$lib/components/WidgetCarousel.svelte') then { default: WidgetCarousel }}
        <WidgetCarousel widgets={mockWidgets} />
      {/await}
    {/if}
  </section>

  <!-- How it works section -->
  <section id="how-it-works" class="border-y bg-background">
    <div class="container px-4">
      <div class="mb-16 flex flex-col items-center text-center">
        <h2 class="h2 mb-3 w-fit border-b-2 border-dashed border-primary pb-1">
          How MEMsched Works
        </h2>
        <p class="text-lg text-muted-foreground">
          Three simple steps to track metrics and showcase your learning journey
        </p>
      </div>

      <div
        class="relative grid w-full grid-cols-1 justify-center gap-12 p-8 max-sm:px-4 lg:grid-cols-3"
      >
        <Path class="absolute left-[21%] top-[-15%] -translate-x-1/2 max-lg:hidden" />
        <Path class="absolute bottom-0 right-[18%] -translate-x-1/2 rotate-180 max-lg:hidden" />
        <div class="flex justify-start gap-6">
          <div
            class="mt-1 inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-300 text-lg font-bold dark:bg-zinc-700"
          >
            1
          </div>
          <div class="space-y-1">
            <Icon className="size-10" src={IoPersonCircle} />
            <h3 class="text-xl font-semibold">Create Learning Objectives & Goals</h3>
            <p class="!mb-3 text-muted-foreground">
              Define measurable learning objectives with specific metrics to track your skill
              development.
            </p>
            <IconButton
              class="animate-svg"
              data-umami-event="how-it-works-create-profile-button"
              href="/auth/signin"
              icon={IoArrowForward}
              size="lg"
            >
              Start Tracking for Free
            </IconButton>
          </div>
        </div>

        <div class="flex justify-start gap-6">
          <div
            class="mt-1 inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-300 text-lg font-bold dark:bg-zinc-700"
          >
            2
          </div>
          <div class="space-y-1">
            <Icon className="size-10" src={IoCube} />
            <h3 class="mb-2 text-xl font-semibold">Log Daily Progress Metrics</h3>
            <p class="text-muted-foreground">
              Regularly update your learning metrics to visualize growth patterns and track
              achievements over time.
            </p>
          </div>
        </div>

        <div class="flex justify-start gap-6">
          <div
            class="mt-1 inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-300 text-lg font-bold dark:bg-zinc-700"
          >
            3
          </div>
          <div class="space-y-1">
            <Icon className="size-10" src={IoGlobe} />
            <h3 class="mb-2 text-xl font-semibold">Embed Progress Widgets Anywhere</h3>
            <p class="text-muted-foreground">
              Generate customizable widgets to embed on your website, GitHub profile, or portfolio
              to showcase your learning metrics.
            </p>
          </div>
        </div>
      </div>
      <div class="mt-28 grid grid-cols-2 gap-10 px-8 text-center max-md:grid-cols-1 max-sm:px-4">
        <div>
          <h3 class="h4 mb-3">Manage multiple learning objectives</h3>
          <enhanced:img
            src="/static/images/objectives.png"
            alt="Learning objectives dashboard tracking multiple skills"
            class="rounded-md border shadow-sm dark:hidden"
            loading="lazy"
          />
          <enhanced:img
            src="/static/images/objectives-dark.png"
            alt="Learning objectives dashboard tracking multiple skills"
            class="hidden rounded-md border shadow-sm dark:block"
            loading="lazy"
          />
        </div>
        <div>
          <h3 class="h4 mb-3">Create custom progress widgets</h3>
          <enhanced:img
            src="/static/images/create-widget.png"
            alt="Create customizable learning progress widgets"
            class="rounded-md border shadow-sm dark:hidden"
            loading="lazy"
          />
          <enhanced:img
            src="/static/images/create-widget-dark.png"
            alt="Create customizable learning progress widgets"
            class="hidden rounded-md border shadow-sm dark:block"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Your Website section -->
  <section id="your-website" class="bg-dotted-fade">
    <div class="main-container mx-auto px-4">
      <div class="mb-10 flex flex-col items-center text-center">
        <h2 class="h2 mb-3 w-fit border-b-2 border-dashed border-green-500 pb-1">
          <span class="me-1 font-bold text-green-500">Embed</span>

          On <span class="me-1 font-bold italic">Your</span> Website
        </h2>
        <p class="text-lg text-muted-foreground">
          Auto-updating progress widgets that seamlessly integrate with your website or portfolio
        </p>
      </div>

      <div class="space-y-8">
        <div class="relative mx-auto w-fit">
          <div class="absolute right-0 top-0 flex items-center justify-center">
            <div class="absolute size-5 rounded-full bg-green-500"></div>
            <div class="absolute size-5 animate-ping rounded-full bg-green-500"></div>
          </div>
          <Widget
            accentColor="#4fc59e"
            backgroundColor="#ffffff"
            borderRadius={6}
            borderWidth={1}
            borderColor="#ededed"
            color="#000000"
            imagePlacement="left"
            imageUrl={FLAT_COLOR_ICONS.graduation_cap}
            metrics={[
              {
                order: 1,
                style: 'plot-metric',
                data: {
                  points: livePoints,
                  value: 2542 + liveIncrement,
                },
                valueName: 'all time',
                valuePercent: false,
              },
            ]}
            padding={13}
            subtitle="Hours invested in learning"
            textIcon={null}
            title="Learning Progress"
            watermark={true}
            dark={mode.current === 'dark'}
          />
        </div>

        <div class="space-y-4">
          <p class="text-center text-lg">
            Embed auto-updating progress widgets on your website with a single line of code
          </p>
          <CodeBlock
            code={codeSnippet}
            language="html"
            copy={false}
            class="mx-auto w-fit justify-center bg-background text-base"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section id="faq" class="z-10 border-y bg-background">
    <div class="main-container mx-auto px-4">
      <div class="mb-16 flex flex-col items-center text-center">
        <h2 class="h2 mb-3 w-fit border-b-2 border-dashed border-primary pb-1">
          Common Questions About MEMsched
        </h2>
        <p class="text-lg text-muted-foreground">
          Learn more about our learning progress tracking platform
        </p>
      </div>

      <div class="mx-auto max-w-3xl">
        <Accordion.Root type="single">
          <Accordion.Item>
            <Accordion.Trigger
              >What is MEMsched and how does it track learning progress?</Accordion.Trigger
            >
            <Accordion.Content class="text-muted-foreground">
              MEMsched is a learning progress tracking platform that helps you set measurable
              learning goals, track skill development metrics, and create embeddable widgets to
              showcase your progress on websites, GitHub profiles, and portfolios.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Trigger
              >How do I embed progress tracking widgets on my website?</Accordion.Trigger
            >
            <Accordion.Content class="text-muted-foreground">
              Simply copy the generated HTML image tag and paste it into your website's code. Your
              progress widget will automatically update in real-time whenever you log new learning
              metrics or achievements.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Trigger>What types of learning metrics can I track?</Accordion.Trigger>
            <Accordion.Content class="text-muted-foreground">
              MEMsched supports various learning metrics including hours spent, completion
              percentage, proficiency levels, books read, courses completed, and custom metrics
              tailored to your specific learning objectives and skill development goals.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Trigger>What are the available subscription plans?</Accordion.Trigger>
            <Accordion.Content class="text-muted-foreground">
              We offer a Free Plan that's free forever - no credit card required. For those who want
              to support our mission, we offer a Pro Plan (the price of two coffees per month) that
              includes unlimited widgets and premium features. Your support helps us grow and
              improve MEMsched for everyone!
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Trigger>Is my learning data secure?</Accordion.Trigger>
            <Accordion.Content class="text-muted-foreground">
              Yes, all your learning metrics and progress data are securely encrypted and stored on
              European servers in compliance with privacy regulations.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  </section>

  <!-- CTA section -->
  <section id="cta" class="bg-dotted-fade">
    <div
      class="main-container flex justify-between gap-10 text-primary max-md:flex-col max-md:items-center max-md:text-center"
    >
      <div>
        <h2 class="mb-2 text-3xl font-bold">Ready to track and showcase your learning journey?</h2>
        <p class="max-w-2xl text-lg opacity-75">
          Join the learners who are tracking their progress and sharing their achievements with the
          world.
        </p>
      </div>
      <div class="relative">
        <Button data-umami-event="cta-get-started-button" href="/auth/signin" size="cta"
          >Start Tracking Now</Button
        >
        <Arrow class="absolute left-[-85%] top-[-85%] rotate-180" />
        <p class="mt-2 text-sm text-muted-foreground">
          No credit card required. Free plan available.
        </p>
      </div>
    </div>
  </section>
</HomeLayout>
