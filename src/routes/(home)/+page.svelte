<script lang="ts">
  import Arrow from '$lib/components/svgs/Arrow.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Icon } from 'svelte-icons-pack';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { IoArrowForward, IoBook, IoCube, IoGlobe, IoPersonCircle } from 'svelte-icons-pack/io';
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
        <h2 class="h2">How It Works</h2>
        <p class="text-lg text-muted-foreground">
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
  <section id="use-cases">
    <div class="container mx-auto max-w-7xl px-4">
      <div class="mb-10 text-center">
        <h2 class="h2">Perfect For</h2>
        <p class="text-lg text-muted-foreground">
          See how different people are using memsched to showcase their learning journey
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card.Root
          class="group overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
        >
          <Card.Header class="pb-2">
            <div class="mb-1 flex items-center gap-3">
              <div
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"
              >
                <Icon src={IoPersonCircle} className="size-6" />
              </div>
              <Card.Title class="text-xl transition-colors group-hover:text-primary"
                >Developers</Card.Title
              >
            </div>
          </Card.Header>
          <Card.Content class="py-2 text-sm text-muted-foreground">
            Showcase your coding progress, track languages you're learning, and display your metrics
            on your GitHub profile.
          </Card.Content>
          <Card.Footer class="pt-3">
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-between transition-all group-hover:bg-primary group-hover:text-white"
              href="/auth/signin"
            >
              Start coding journey
              <Icon src={IoArrowForward} className="size-4" />
            </Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root
          class="group overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
        >
          <Card.Header class="pb-2">
            <div class="mb-1 flex items-center gap-3">
              <div
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600"
              >
                <Icon src={IoBook} className="size-6" />
              </div>
              <Card.Title class="text-xl transition-colors group-hover:text-primary"
                >Students</Card.Title
              >
            </div>
          </Card.Header>
          <Card.Content class="py-2 text-sm text-muted-foreground">
            Keep track of courses completed, skills acquired, and study hours. Share your academic
            progress on your portfolio.
          </Card.Content>
          <Card.Footer class="pt-3">
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-between transition-all group-hover:bg-primary group-hover:text-white"
              href="/auth/signin"
            >
              Track your studies
              <Icon src={IoArrowForward} className="size-4" />
            </Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root
          class="group overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
        >
          <Card.Header class="pb-2">
            <div class="mb-1 flex items-center gap-3">
              <div
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600"
              >
                <Icon src={IoGlobe} className="size-6" />
              </div>
              <Card.Title class="text-xl transition-colors group-hover:text-primary"
                >Language Learners</Card.Title
              >
            </div>
          </Card.Header>
          <Card.Content class="py-2 text-sm text-muted-foreground">
            Monitor vocabulary growth, practice time, and fluency improvements. Share your language
            learning journey.
          </Card.Content>
          <Card.Footer class="pt-3">
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-between transition-all group-hover:bg-primary group-hover:text-white"
              href="/auth/signin"
            >
              Learn languages
              <Icon src={IoArrowForward} className="size-4" />
            </Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root
          class="group overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
        >
          <Card.Header class="pb-2">
            <div class="mb-1 flex items-center gap-3">
              <div
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600"
              >
                <Icon src={IoCube} className="size-6" />
              </div>
              <Card.Title class="text-xl transition-colors group-hover:text-primary"
                >Content Creators</Card.Title
              >
            </div>
          </Card.Header>
          <Card.Content class="py-2 text-sm text-muted-foreground">
            Track your content output, audience growth, and engagement metrics. Embed your progress
            on your website.
          </Card.Content>
          <Card.Footer class="pt-3">
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-between transition-all group-hover:bg-primary group-hover:text-white"
              href="/auth/signin"
            >
              Grow your audience
              <Icon src={IoArrowForward} className="size-4" />
            </Button>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  </section>

  <!-- Testimonials (placeholder) -->
  <section id="testimonials" class="border-y bg-background">
    <div class="main-container mx-auto px-4">
      <div class="mb-16 text-center">
        <h2 class="h2">What Our Users Say</h2>
        <p class="text-lg text-muted-foreground">
          Join thousands of learners tracking their journey
        </p>
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
