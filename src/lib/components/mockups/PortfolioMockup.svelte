<script lang="ts">
  import BrowserLayout from '../layouts/BrowserLayout.svelte';
</script>

<BrowserLayout>
  <!-- Portfolio content - only hero section -->
  <div class="portfolio-content">
    <!-- Header with navigation -->
    <header class="bg-slate-900 text-white">
      <div class="container mx-auto flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-white"
          >
            AC
          </div>
          <span class="font-semibold">Alex Chen</span>
        </div>
        <nav class="hidden items-center gap-8 md:flex">
          <a href="#about" class="text-white/90 transition-colors hover:text-white">About</a>
          <a href="#projects" class="text-white/90 transition-colors hover:text-white">Projects</a>
          <a href="#experience" class="text-white/90 transition-colors hover:text-white"
            >Experience</a
          >
          <a href="#learning" class="font-medium text-white/90 transition-colors hover:text-white"
            >Learning</a
          >
          <a href="#contact" class="text-white/90 transition-colors hover:text-white">Contact</a>
        </nav>
        <div class="hidden md:block">
          <button
            class="rounded-md bg-white/10 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/20"
            >Resume</button
          >
        </div>
      </div>
    </header>

    <!-- Hero Section - with Learning Journey highlight -->
    <section class="bg-gradient-to-br from-slate-900 to-slate-800 py-16 text-white">
      <div class="container mx-auto px-6">
        <div class="flex flex-col gap-8 md:flex-row">
          <div class="space-y-6 md:w-1/2">
            <div class="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">
              Full-Stack Developer
            </div>
            <h1 class="text-3xl font-bold">Building digital products & tracking my progress</h1>
            <p class="text-slate-300">
              I showcase my continuous learning journey with beautiful widgets that update
              automatically as I improve my skills.
            </p>
          </div>
          <div class="md:w-1/2">
            <!-- Learning Widget Preview -->
            <div class="rounded-lg bg-white p-4 text-slate-800 shadow-lg">
              <div class="mb-4 flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <div class="text-lg font-bold text-blue-600">R</div>
                </div>
                <div>
                  <div class="font-semibold">React Mastery</div>
                  <div class="text-xs text-slate-500">Frontend Development</div>
                </div>
              </div>
              <div class="mb-3">
                <div class="mb-1 flex justify-between text-sm">
                  <span>Progress</span>
                  <span class="font-medium">86%</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100">
                  <div class="h-full rounded-full bg-blue-500" style="width: 86%"></div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center text-sm">
                <div class="rounded bg-slate-50 p-2">
                  <div class="font-bold">42</div>
                  <div class="text-xs text-slate-500">Days</div>
                </div>
                <div class="rounded bg-slate-50 p-2">
                  <div class="font-bold">18</div>
                  <div class="text-xs text-slate-500">Projects</div>
                </div>
                <div class="rounded bg-slate-50 p-2">
                  <div class="font-bold">4.7</div>
                  <div class="text-xs text-slate-500">Rating</div>
                </div>
              </div>
              <div class="mt-3 text-right text-xs text-slate-400">Powered by memsched</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</BrowserLayout>

<style>
  .portfolio-content {
    background-color: white;
  }
</style>
