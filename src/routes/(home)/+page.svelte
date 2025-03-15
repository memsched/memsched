<script lang="ts">
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
</script>

<HomeLayout container={false} class="*:py-20">
  <section
    id="hero"
    class="main-container flex h-screen flex-grow flex-col items-center justify-center !pb-0 text-center"
  >
    <div class="space-y-3">
      <Badge class="text-sm" variant="translucent">v2 Released 🎉</Badge>
      <h1>Show the world what you're learning.</h1>
      <h2 class="h4 font-medium">
        Set goals, log progress, and showcase your journey with beautiful widgets.
      </h2>
    </div>
    <div class="relative mt-8 w-fit">
      <Button size="cta" href="/auth/signin">Get Started for Free</Button>
      <Arrow class="absolute left-[105%] top-[60%] -z-10 rotate-6" />
    </div>
    <div class="mt-20">
      <WidgetCarousel widgets={mockWidgets} />
    </div>
  </section>

  <!-- How it works section -->
  <section id="how-it-works" class="border-y bg-background">
    <div class="container mx-auto px-4">
      <div class="mb-16 text-center">
        <h3 class="text-3xl font-bold">How It Works</h3>
        <p class="text-xl text-muted-foreground">
          Three simple steps to showcase your learning journey
        </p>
      </div>

      <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div class="flex justify-center gap-6">
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
            <IconButton icon={IoArrowForward} size="lg" href="/auth/signin" class="animate-svg">
              Create Profile for Free
            </IconButton>
          </div>
        </div>

        <div class="flex justify-center gap-6">
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

        <div class="flex justify-center gap-6">
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

  <!-- Use cases section -->
  <section id="use-cases" class="bg-slate-50">
    <div class="container mx-auto px-4">
      <div class="mb-10 text-center">
        <h2 class="text-3xl font-bold">Perfect For</h2>
        <p class="text-xl text-muted-foreground">See how different people are using memsched</p>
      </div>
      <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
        <Card.Root>
          <Card.Header>
            <Card.Title>Developers</Card.Title>
          </Card.Header>
          <Card.Content>
            Showcase your coding progress, track languages you're learning, and display your metrics
            on your GitHub profile to stand out to potential employers.
          </Card.Content>
          <Card.Footer>
            <Button href="/auth/signin">Start coding journey</Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Students</Card.Title>
          </Card.Header>
          <Card.Content>
            Keep track of courses completed, skills acquired, and study hours. Share your academic
            progress on your portfolio or LinkedIn profile.
          </Card.Content>
          <Card.Footer>
            <Button href="/auth/signin">Track your studies</Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Language Learners</Card.Title>
          </Card.Header>
          <Card.Content>
            Monitor vocabulary growth, practice time, and fluency improvements. Share your language
            learning journey on social media.
          </Card.Content>
          <Card.Footer>
            <Button href="/auth/signin">Learn languages</Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Content Creators</Card.Title>
          </Card.Header>
          <Card.Content>
            Track your content output, audience growth, and engagement metrics. Embed your progress
            on your website to build transparency with your audience.
          </Card.Content>
          <Card.Footer>
            <Button href="/auth/signin">Grow your audience</Button>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  </section>

  <!-- Testimonials (placeholder) -->
  <section id="testimonials" class="border-y bg-background">
    <div class="main-container mx-auto px-4">
      <div class="mb-16 text-center">
        <h3 class="text-3xl font-bold">What Our Users Say</h3>
        <p class="mt-4 text-xl text-slate-600">Join thousands of learners tracking their journey</p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div class="rounded-lg border border-slate-100 p-6 shadow-sm">
          <div class="mb-4 flex items-center">
            <div class="h-12 w-12 rounded-full bg-primary/20"></div>
            <div class="ml-4">
              <h4 class="text-lg font-semibold">Alex Johnson</h4>
              <p class="text-sm text-slate-500">Software Developer</p>
            </div>
          </div>
          <p class="text-slate-600">
            "I've been using memsched to track my progress learning Rust. The widgets on my GitHub
            profile have attracted attention from recruiters who appreciate seeing my commitment to
            growing my skills."
          </p>
        </div>

        <div class="rounded-lg border border-slate-100 p-6 shadow-sm">
          <div class="mb-4 flex items-center">
            <div class="h-12 w-12 rounded-full bg-primary/20"></div>
            <div class="ml-4">
              <h4 class="text-lg font-semibold">Maria Rodriguez</h4>
              <p class="text-sm text-slate-500">Language Enthusiast</p>
            </div>
          </div>
          <p class="text-slate-600">
            "Being able to visualize my Japanese learning journey has been incredibly motivating. I
            love sharing my progress widgets on social media and seeing the support from my
            community."
          </p>
        </div>

        <div class="rounded-lg border border-slate-100 p-6 shadow-sm">
          <div class="mb-4 flex items-center">
            <div class="h-12 w-12 rounded-full bg-primary/20"></div>
            <div class="ml-4">
              <h4 class="text-lg font-semibold">David Lee</h4>
              <p class="text-sm text-slate-500">CS Student</p>
            </div>
          </div>
          <p class="text-slate-600">
            "As a computer science student, memsched helps me keep track of all the new technologies
            I'm learning. My professor was impressed when I included my learning widgets in my final
            project presentation."
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA section -->
  <section
    id="cta"
    class="main-container flex justify-between gap-10 max-md:flex-col max-md:items-center max-md:text-center"
  >
    <div>
      <h2 class="mb-2 text-3xl font-bold">Ready to showcase your learning journey?</h2>
      <p class="mx-auto max-w-2xl text-lg">
        Join thousands of learners who are tracking their progress and sharing their achievements
        with the world.
      </p>
    </div>
    <div class="relative">
      <Button size="cta" href="/auth/signin">Get Started for Free</Button>
      <Arrow class="absolute left-[-85%] top-[-85%] -z-10 rotate-180" />
      <p class="mt-2 text-sm text-muted-foreground">
        No credit card required. Free plan available.
      </p>
    </div>
  </section>
</HomeLayout>
