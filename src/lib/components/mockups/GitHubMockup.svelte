<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { FiGithub, FiStar, FiGitBranch, FiBookOpen } from 'svelte-icons-pack/fi';
  import BrowserLayout from '../layouts/BrowserLayout.svelte';
</script>

<BrowserLayout>
  <!-- GitHub content -->
  <div class="github-content bg-white p-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <!-- GitHub header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon src={FiGithub} size="24" className="text-gray-800 dark:text-gray-200" />
        <div class="flex items-center gap-4">
          <span class="text-sm font-semibold">alexchen</span>
          <span
            class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >README.md</span
          >
        </div>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <div class="flex items-center gap-1">
          <Icon src={FiStar} size="14" className="text-gray-600 dark:text-gray-400" />
          <span>Star</span>
          <span class="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">149</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon src={FiGitBranch} size="14" className="text-gray-600 dark:text-gray-400" />
          <span>Fork</span>
          <span class="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">23</span>
        </div>
      </div>
    </div>

    <!-- GitHub README content -->
    <div class="github-readme rounded-md border border-gray-200 p-5 dark:border-gray-700">
      <h1 class="mb-3 text-2xl font-bold">Hi there 👋, I'm Alex Chen</h1>
      <p class="mb-5 text-gray-700 dark:text-gray-300">
        I'm a full-stack developer passionate about building accessible, user-friendly applications.
        Currently learning and growing every day!
      </p>

      <div class="markdown-section mb-6">
        <h2
          class="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2 text-lg font-semibold dark:border-gray-700"
        >
          <Icon src={FiBookOpen} size="18" className="text-gray-600 dark:text-gray-400" />
          <span>My Learning Journey</span>
        </h2>

        <p class="mb-4 text-gray-700 dark:text-gray-300">
          I track my learning progress with memsched. Here's what I'm currently focusing on:
        </p>

        <!-- Memsched widget in GitHub README -->
        <div class="mb-3 flex justify-center">
          <div
            class="w-full max-w-md rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900"
                >
                  <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">JS</span>
                </div>
                <div>
                  <div class="font-medium text-gray-800 dark:text-gray-200">
                    Advanced JavaScript
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Frontend Development</div>
                </div>
              </div>
              <div class="text-xs font-medium text-blue-600 dark:text-blue-400">76%</div>
            </div>

            <div class="mb-3">
              <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-blue-500 dark:bg-blue-600"
                  style="width: 76%"
                ></div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div class="text-center">
                <div class="text-sm font-semibold">64</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Days</div>
              </div>
              <div class="text-center">
                <div class="text-sm font-semibold">21</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Projects</div>
              </div>
              <div class="text-center">
                <div class="text-sm font-semibold">4.5</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <div
            class="w-full max-w-md rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 dark:bg-green-900"
                >
                  <span class="text-sm font-semibold text-green-600 dark:text-green-400">P</span>
                </div>
                <div>
                  <div class="font-medium text-gray-800 dark:text-gray-200">
                    Python for Data Science
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Data Analytics</div>
                </div>
              </div>
              <div class="text-xs font-medium text-green-600 dark:text-green-400">42%</div>
            </div>

            <div class="mb-3">
              <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-green-500 dark:bg-green-600"
                  style="width: 42%"
                ></div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div class="text-center">
                <div class="text-sm font-semibold">2</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Months</div>
              </div>
              <div class="text-center">
                <div class="text-sm font-semibold">7</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Projects</div>
              </div>
              <div class="text-center">
                <div class="text-sm font-semibold">3.8</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Rating</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Widget attribution -->
        <div class="mt-3 text-center">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Powered by <a href="#" class="text-blue-600 hover:underline dark:text-blue-400"
              >memsched</a
            >
          </div>
        </div>
      </div>

      <div class="github-stats">
        <h2 class="mb-3 border-b border-gray-200 pb-2 text-lg font-semibold dark:border-gray-700">
          GitHub Stats
        </h2>
        <div class="flex flex-wrap gap-4">
          <div
            class="rounded-md border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="text-sm font-semibold">125</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Repositories</div>
          </div>
          <div
            class="rounded-md border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="text-sm font-semibold">1,254</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Contributions</div>
          </div>
          <div
            class="rounded-md border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="text-sm font-semibold">37</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Pull Requests</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</BrowserLayout>

<style>
  .github-content {
    background-color: white;
  }

  :global(.dark) .github-content {
    background-color: #111827; /* dark:bg-gray-900 */
  }
</style>
