<script lang="ts">
  import { onMount } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { IoArrowForward, IoCube, IoGlobe, IoPersonCircle } from 'svelte-icons-pack/io';

  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import Arrow from '$lib/components/svgs/Arrow.svelte';
  import Path from '$lib/components/svgs/Path.svelte';
  import * as Accordion from '$lib/components/ui/accordion';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import WidgetCarousel from '$lib/components/WidgetCarousel.svelte';
  import Widget from '$lib/components/widgets/Widget.svelte';
  import { HEADER_HEIGHT } from '$lib/constants';
  import { FLAT_COLOR_ICONS } from '$lib/icons';
  import { mockWidgets } from '$lib/widgets';

  const codeSnippet = `
<img src="https://memsched.com/api/widgets/example?svg" />`;

  let liveIncrement = $state(0);

  onMount(() => {
    setInterval(
      () => {
        liveIncrement++;
      },
      Math.floor(Math.random() * 2000) + 500
    ); // Random interval between 1-4 seconds
  });
</script>

<HomeLayout container={false} class="*:py-20">
  <section
    id="hero"
    class="flex h-full max-h-[900px] flex-col items-center justify-between !pb-0 text-center"
    style="height: calc(100vh - {HEADER_HEIGHT}px)"
  >
    <div class="main-container flex flex-col items-center justify-center gap-8 py-20">
      <div class="space-y-3">
        <Badge class="text-sm" variant="translucent">v2 Released 🎉</Badge>
        <h1>Show the world what you're learning.</h1>
        <h2 class="h4 font-medium">
          Set goals, log progress, and showcase your journey with beautiful widgets.
        </h2>
      </div>
      <div class="relative w-fit">
        <Button size="cta" href="/auth/signin" data-umami-event="hero-get-started-button"
          >Get Started for Free</Button
        >
        <Arrow class="absolute left-[105%] top-[60%] -z-10 rotate-6" />
      </div>
    </div>
    <WidgetCarousel widgets={mockWidgets} />
  </section>

  <!-- How it works section -->
  <section id="how-it-works" class="border-y bg-background">
    <div class="container mx-auto px-4">
      <div class="mb-16 flex flex-col items-center text-center">
        <h2 class="h2 mb-3 w-fit border-b-2 border-dashed border-primary pb-1">How It Works</h2>
        <p class="text-lg text-muted-foreground">
          Three simple steps to showcase your learning journey
        </p>
      </div>

      <div
        class="relative grid w-full grid-cols-1 justify-center gap-12 py-8 max-lg:px-16 lg:grid-cols-3"
      >
        <Path class="absolute left-[21%] top-[-15%] -translate-x-1/2 max-lg:hidden" />
        <Path class="absolute bottom-0 right-[18%] -translate-x-1/2 rotate-180 max-lg:hidden" />
        <div class="flex justify-start gap-6">
          <div
            class="mt-1 inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-300 text-lg font-bold"
          >
            1
          </div>
          <div class="space-y-1">
            <Icon src={IoPersonCircle} className="size-10" />
            <h3 class="text-xl font-semibold">Setup Profile & Create an Objective</h3>
            <p class="!mb-3 text-muted-foreground">
              Set up a new learning objective with your goals and metrics to track.
            </p>
            <IconButton
              icon={IoArrowForward}
              size="lg"
              href="/auth/signin"
              class="animate-svg"
              data-umami-event="how-it-works-create-profile-button"
            >
              Create Profile for Free
            </IconButton>
          </div>
        </div>

        <div class="flex justify-start gap-6">
          <div
            class="mt-1 inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-300 text-lg font-bold"
          >
            2
          </div>
          <div class="space-y-1">
            <Icon src={IoCube} className="size-10" />
            <h3 class="mb-2 text-xl font-semibold">Log Your Progress</h3>
            <p class="text-muted-foreground">
              Regularly update your metrics to see your growth over time.
            </p>
          </div>
        </div>

        <div class="flex justify-start gap-6">
          <div
            class="mt-1 inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-300 text-lg font-bold"
          >
            3
          </div>
          <div class="space-y-1">
            <Icon src={IoGlobe} className="size-10" />
            <h3 class="mb-2 text-xl font-semibold">Share Your Widgets</h3>
            <p class="text-muted-foreground">
              Generate custom widgets and embed them wherever you want to showcase your journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Your Website section -->
  <section id="your-website" class="main-container mx-auto px-4">
    <div class="mb-10 flex flex-col items-center text-center">
      <h2 class="h2 mb-3 w-fit border-b-2 border-dashed border-green-500 pb-1">
        <span class="me-1 font-bold text-green-500">Live</span>

        On <span class="me-1 font-bold italic">Your</span> Website
      </h2>
      <p class="text-lg text-muted-foreground">
        Beautiful widgets that seamlessly integrate with your website or portfolio
      </p>
    </div>

    <div class="space-y-8">
      <div class="relative mx-auto w-fit">
        <div class="absolute right-0 top-0 flex items-center justify-center">
          <div class="absolute size-5 rounded-full bg-green-500"></div>
          <div class="absolute size-5 animate-ping rounded-full bg-green-500"></div>
        </div>
        <Widget
          title="Learning Progress"
          subtitle="Hours invested in learning"
          imageUrl={FLAT_COLOR_ICONS.graduation_cap}
          imagePlacement="left"
          textIcon={null}
          metrics={[
            {
              order: 1,
              style: 'metric-trend',
              data: {
                value: 85 + liveIncrement,
              },
              name: 'this month',
              period: 'month',
              valueDisplayPrecision: 0,
            },
            {
              order: 2,
              style: 'metric-trend',
              data: {
                value: 450 + liveIncrement,
              },
              name: 'total hours',
              period: 'all time',
              valueDisplayPrecision: 0,
            },
          ]}
          padding={13}
          border={true}
          borderWidth={1}
          borderRadius={6}
          color="#000000"
          accentColor="#4f8bce"
          backgroundColor="#ffffff"
          watermark={true}
        />
      </div>

      <div class="space-y-4">
        <p class="text-center text-lg">
          Embed widgets like this one on your website with a single line of code
        </p>
        <pre class="mx-auto w-fit rounded-lg border bg-zinc-800 px-4 font-mono text-sm text-white">
          <code class="whitespace-pre-wrap">{codeSnippet}</code>
        </pre>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section id="faq" class="border-y bg-background">
    <div class="main-container mx-auto px-4">
      <div class="mb-16 flex flex-col items-center text-center">
        <h2 class="h2 mb-3 w-fit border-b-2 border-dashed border-primary pb-1">
          Frequently Asked Questions
        </h2>
        <p class="text-lg text-muted-foreground">
          Common questions about MEMsched and how it works
        </p>
      </div>

      <div class="mx-auto max-w-3xl">
        <Accordion.Root type="single">
          <Accordion.Item>
            <Accordion.Trigger>What is MEMsched and how does it work?</Accordion.Trigger>
            <Accordion.Content>
              MEMsched is a web app that helps you track learning objectives and create widgets to
              showcase your progress on websites, GitHub profiles, and portfolios.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Trigger>How do I embed widgets on my website?</Accordion.Trigger>
            <Accordion.Content>
              Simply copy the provided HTML image tag and paste it into your website's code. Your
              widget will automatically update whenever you log new progress.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Trigger>What are the available subscription plans?</Accordion.Trigger>
            <Accordion.Content>
              We offer a Free Plan that's free forever - no credit card required. For those who want
              to support our mission, we offer a Pro Plan (the price of two coffees per month) that
              includes unlimited widgets and premium features. Your support helps us grow and
              improve MEMsched for everyone!
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Trigger>How is my data protected?</Accordion.Trigger>
            <Accordion.Content>
              We encrypt all data and store it on European servers in compliance with FADP and GDPR
              regulations. We never share or sell your personal information.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Trigger>Can I delete my account and data?</Accordion.Trigger>
            <Accordion.Content>
              You can delete your account at any time. We'll immediately anonymize your data and
              remove your objectives and widgets, with all remaining data being permanently deleted
              after 30 days.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  </section>

  <!-- CTA section -->
  <section
    id="cta"
    class="main-container flex justify-between gap-10 text-primary max-md:flex-col max-md:items-center max-md:text-center"
  >
    <div>
      <h2 class="mb-2 text-3xl font-bold">Ready to showcase your learning journey?</h2>
      <p class="mx-auto max-w-2xl text-lg">
        Join thousands of learners who are tracking their progress and sharing their achievements
        with the world.
      </p>
    </div>
    <div class="relative">
      <Button size="cta" href="/auth/signin" data-umami-event="cta-get-started-button"
        >Get Started for Free</Button
      >
      <Arrow class="absolute left-[-85%] top-[-85%] -z-10 rotate-180" />
      <p class="mt-2 text-sm text-muted-foreground">
        No credit card required. Free plan available.
      </p>
    </div>
  </section>
</HomeLayout>
