<script lang="ts">
  import { onMount } from 'svelte';
  import Arrow from '$lib/components/svgs/Arrow.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Icon } from 'svelte-icons-pack';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { IoArrowForward, IoCube, IoGlobe, IoPersonCircle } from 'svelte-icons-pack/io';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import WidgetCarousel from '$lib/components/WidgetCarousel.svelte';
  import { mockWidgets } from '$lib/widgets';
  import * as Card from '$lib/components/ui/card';
  import { HEADER_HEIGHT } from '$lib/constants';
  import Path from '$lib/components/svgs/Path.svelte';
  import Widget from '$lib/components/Widget.svelte';
  import { FLAT_COLOR_ICONS } from '$lib/icons';

  const codeSnippet = `
<img src="https://memsched.com/api/widgets/learning-progress?svg" />`;

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
    class="flex h-full flex-col items-center justify-between !pb-0 text-center"
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

    <div class="flex flex-col items-center gap-8">
      <div class="relative">
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
              name: 'this month',
              value: 85 + liveIncrement,
              calculationType: 'hour',
              valueDecimalPrecision: 0,
              order: 1,
            },
            {
              name: 'total hours',
              value: 450 + liveIncrement,
              calculationType: 'hour',
              valueDecimalPrecision: 0,
              order: 2,
            },
          ]}
          padding={13}
          border={true}
          borderWidth={1}
          borderRadius={6}
          color="#000000"
          accentColor="#4f8bce"
          backgroundColor="#ffffff"
          watermark={false}
        />
      </div>

      <div class="flex flex-col items-center gap-4">
        <p class="text-center text-lg">
          Embed widgets like this one on your website with a single line of code
        </p>
        <pre class="w-full rounded-lg border bg-zinc-800 px-4 font-mono text-sm text-white">
          <code>{codeSnippet}</code>
        </pre>
      </div>
    </div>
  </section>

  <!-- Testimonials (placeholder) -->
  <section id="testimonials" class="border-y bg-background">
    <div class="main-container mx-auto px-4">
      <div class="mb-16 flex flex-col items-center text-center">
        <h2 class="h2 mb-3 w-fit border-b-2 border-dashed border-primary pb-1">
          What Our Users Say
        </h2>
        <p class="text-lg text-muted-foreground">
          Join the community of learners tracking their journey
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card.Root>
          <Card.Header>
            <div class="mb-1 flex items-center gap-4">
              <div class="h-12 w-12 rounded-full bg-primary/20"></div>
              <div>
                <h3 class="h5">Alex Johnson</h3>
                <p class="text-sm text-muted-foreground">Software Developer</p>
              </div>
            </div>
          </Card.Header>
          <Card.Content class="text-sm text-muted-foreground">
            "I've been using memsched to track my progress learning Rust. The widgets on my GitHub
            profile have attracted attention from recruiters who appreciate seeing my commitment to
            growing my skills."
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <div class="mb-1 flex items-center gap-4">
              <div class="h-12 w-12 rounded-full bg-primary/20"></div>
              <div>
                <h3 class="h5">Maria Rodriguez</h3>
                <p class="text-sm text-muted-foreground">Language Enthusiast</p>
              </div>
            </div>
          </Card.Header>
          <Card.Content class="text-sm text-muted-foreground">
            "Being able to visualize my Japanese learning journey has been incredibly motivating. I
            love sharing my progress widgets on social media and seeing the support from my
            community."
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <div class="mb-1 flex items-center gap-4">
              <div class="h-12 w-12 rounded-full bg-primary/20"></div>
              <div>
                <h3 class="h5">David Lee</h3>
                <p class="text-sm text-muted-foreground">CS Student</p>
              </div>
            </div>
          </Card.Header>
          <Card.Content class="text-sm text-muted-foreground">
            "I use memsched to track my progress learning different programming languages and
            frameworks. It helps me stay organized and motivated as I work through my CS
            coursework."
          </Card.Content>
        </Card.Root>
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
