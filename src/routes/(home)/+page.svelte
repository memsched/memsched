<script lang="ts">
  import Arrow from '$lib/components/svgs/Arrow.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
</script>

<section id="hero" class="flex flex-col items-center text-center">
  <div class="space-y-3">
    <Badge class="text-sm">v2 Released 🎉</Badge>
    <h1>Show the world what you're learning.</h1>
    <h4 class="font-medium">
      Set goals, log progress, and showcase your journey with beautiful widgets.
    </h4>
  </div>
  <div class="relative mt-8 w-fit">
    <Button size="cta">Get Started for Free</Button>
    <Arrow class="tran absolute left-[105%]  top-[60%] rotate-6" />
  </div>
</section>
