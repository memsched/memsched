<script lang="ts">
  import Arrow from '$lib/components/svgs/Arrow.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import Widgets from '$lib/components/svgs/Widgets.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FiGithub, FiLinkedin, FiMonitor } from 'svelte-icons-pack/fi';
  import PortfolioMockup from '$lib/components/mockups/PortfolioMockup.svelte';
  import GitHubMockup from '$lib/components/mockups/GitHubMockup.svelte';
  import LinkedInMockup from '$lib/components/mockups/LinkedInMockup.svelte';
  import * as Tabs from '$lib/components/ui/tabs';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
</script>

<HomeLayout container={false} class="gap-16 *:py-20">
  <section id="hero" class="flex flex-grow flex-col items-center justify-center text-center">
    <div class="space-y-3">
      <Badge class="text-sm" variant="translucent">v2 Released 🎉</Badge>
      <h1>Show the world what you're learning.</h1>
      <h4 class="font-medium">
        Set goals, log progress, and showcase your journey with beautiful widgets.
      </h4>
    </div>
    <div class="relative mt-8 w-fit">
      <Button size="cta" href="/auth/signin">Get Started for Free</Button>
      <Arrow class="tran absolute left-[105%] top-[60%] -z-10 rotate-6" />
    </div>
    <div class="mt-24">
      <Widgets />
    </div>
  </section>

  <!-- Showcase Mockup section (2-column) -->
  <section id="showcase" class="border-t bg-background">
    <div class="mb-10 text-center">
      <h2 class="text-3xl font-bold">Embed Your Learning Journey Anywhere</h2>
      <p class="mt-2 text-xl text-muted-foreground">
        Seamlessly showcase your progress wherever your professional presence lives
      </p>
    </div>
    <Tabs.Root value="portfolio" class="flex flex-col items-center">
      <Tabs.List class="mb-4 gap-3 px-2 py-7">
        <Tabs.Trigger value="portfolio">
          <div class="rounded-full p-2">
            <Icon src={FiMonitor} className="!text-primary" />
          </div>
          <h3 class="text-base font-semibold">Portfolio</h3>
        </Tabs.Trigger>
        <Tabs.Trigger value="github">
          <div class="rounded-full p-2">
            <Icon src={FiGithub} className="!text-primary" />
          </div>
          <h3 class="text-base font-semibold">GitHub</h3>
        </Tabs.Trigger>
        <Tabs.Trigger value="linkedin">
          <div class="rounded-full p-2">
            <Icon src={FiLinkedin} className="!text-primary" />
          </div>
          <h3 class="text-base font-semibold">LinkedIn</h3>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="portfolio">
        <PortfolioMockup />
      </Tabs.Content>
      <Tabs.Content value="github">
        <GitHubMockup />
      </Tabs.Content>
      <Tabs.Content value="linkedin">
        <LinkedInMockup />
      </Tabs.Content>
    </Tabs.Root>
  </section>

  <!-- How it works section -->
  <section id="how-it-works" class="">
    <div class="container mx-auto px-4">
      <div class="mb-16 text-center">
        <h2 class="text-3xl font-bold">How It Works</h2>
        <p class="mt-4 text-xl text-slate-600">
          Three simple steps to showcase your learning journey
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div class="text-center">
          <div
            class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold"
          >
            1
          </div>
          <h3 class="mb-2 text-xl font-semibold">Create a Project</h3>
          <p class="text-slate-600">
            Set up a new learning project with your goals and metrics to track.
          </p>
        </div>

        <div class="text-center">
          <div
            class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold"
          >
            2
          </div>
          <h3 class="mb-2 text-xl font-semibold">Log Your Progress</h3>
          <p class="text-slate-600">Regularly update your metrics to see your growth over time.</p>
        </div>

        <div class="text-center">
          <div
            class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold"
          >
            3
          </div>
          <h3 class="mb-2 text-xl font-semibold">Share Your Widgets</h3>
          <p class="text-slate-600">
            Generate custom widgets and embed them wherever you want to showcase your journey.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Use cases section -->
  <section id="use-cases" class="bg-slate-50">
    <div class="container mx-auto px-4">
      <div class="mb-16 text-center">
        <h2 class="text-3xl font-bold">Perfect For</h2>
        <p class="mt-4 text-xl text-slate-600">See how different people are using memsched</p>
      </div>

      <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div class="rounded-lg p-8 shadow-sm">
          <h3 class="mb-4 text-2xl font-semibold">Developers</h3>
          <p class="mb-4 text-slate-600">
            Showcase your coding progress, track languages you're learning, and display your metrics
            on your GitHub profile to stand out to potential employers.
          </p>
          <Button variant="outline" href="/auth/signin">Start coding journey</Button>
        </div>

        <div class="rounded-lg p-8 shadow-sm">
          <h3 class="mb-4 text-2xl font-semibold">Students</h3>
          <p class="mb-4 text-slate-600">
            Keep track of courses completed, skills acquired, and study hours. Share your academic
            progress on your portfolio or LinkedIn profile.
          </p>
          <Button variant="outline" href="/auth/signin">Track your studies</Button>
        </div>

        <div class="rounded-lg p-8 shadow-sm">
          <h3 class="mb-4 text-2xl font-semibold">Language Learners</h3>
          <p class="mb-4 text-slate-600">
            Monitor vocabulary growth, practice time, and fluency improvements. Share your language
            learning journey on social media.
          </p>
          <Button variant="outline" href="/auth/signin">Learn languages</Button>
        </div>

        <div class="rounded-lg p-8 shadow-sm">
          <h3 class="mb-4 text-2xl font-semibold">Content Creators</h3>
          <p class="mb-4 text-slate-600">
            Track your content output, audience growth, and engagement metrics. Embed your progress
            on your website to build transparency with your audience.
          </p>
          <Button variant="outline" href="/auth/signin">Grow your audience</Button>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials (placeholder) -->
  <section id="testimonials" class="">
    <div class="container mx-auto px-4">
      <div class="mb-16 text-center">
        <h2 class="text-3xl font-bold">What Our Users Say</h2>
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
  <section id="cta" class="bg-primary text-primary-foreground">
    <div class="container mx-auto px-4 text-center">
      <h2 class="mb-6 text-3xl font-bold">Ready to showcase your learning journey?</h2>
      <p class="mx-auto mb-8 max-w-2xl text-xl">
        Join thousands of learners who are tracking their progress and sharing their achievements
        with the world.
      </p>
      <Button size="cta" variant="secondary" href="/auth/signin">Get Started for Free</Button>
      <p class="mt-4 text-sm opacity-80">No credit card required. Free plan available.</p>
    </div>
  </section>
</HomeLayout>
