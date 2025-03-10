<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import {
    FiLinkedin,
    FiMessageSquare,
    FiBell,
    FiSearch,
    FiHome,
    FiUsers,
    FiBriefcase,
    FiFileText,
  } from 'svelte-icons-pack/fi';
  import BrowserLayout from '../layouts/BrowserLayout.svelte';
</script>

<BrowserLayout>
  <!-- LinkedIn content -->
  <div class="linkedin-content bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <!-- LinkedIn header -->
    <header
      class="border-b border-gray-200 bg-white px-6 py-2 dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Icon src={FiLinkedin} size="30" className="text-blue-600 dark:text-blue-400" />
          <div class="relative w-64">
            <input
              type="text"
              placeholder="Search"
              class="w-full rounded-md bg-gray-100 py-2 pl-8 pr-2 text-xs dark:bg-gray-800 dark:text-gray-300"
            />
            <div class="absolute left-2 top-2 text-gray-500 dark:text-gray-400">
              <Icon src={FiSearch} size="14" />
            </div>
          </div>
        </div>
        <nav class="flex items-center gap-6">
          <div class="flex flex-col items-center text-xs">
            <Icon src={FiHome} size="18" className="text-gray-500 dark:text-gray-400" />
            <span>Home</span>
          </div>
          <div class="flex flex-col items-center text-xs">
            <Icon src={FiUsers} size="18" className="text-gray-500 dark:text-gray-400" />
            <span>Network</span>
          </div>
          <div class="flex flex-col items-center text-xs">
            <Icon src={FiBriefcase} size="18" className="text-gray-500 dark:text-gray-400" />
            <span>Jobs</span>
          </div>
          <div class="flex flex-col items-center text-xs">
            <Icon src={FiMessageSquare} size="18" className="text-gray-500 dark:text-gray-400" />
            <span>Messaging</span>
          </div>
          <div class="flex flex-col items-center text-xs">
            <Icon src={FiBell} size="18" className="text-gray-500 dark:text-gray-400" />
            <span>Notifications</span>
          </div>
          <div
            class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white"
          >
            A
          </div>
        </nav>
      </div>
    </header>

    <!-- LinkedIn Profile -->
    <div class="profile-content bg-gray-100 px-6 pb-8 pt-4 dark:bg-gray-800">
      <!-- Profile Card -->
      <div
        class="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      >
        <!-- Banner & Profile Photo -->
        <div class="relative">
          <div class="h-32 bg-gradient-to-r from-blue-500 to-blue-700"></div>
          <div class="absolute bottom-0 left-6 translate-y-1/2 transform">
            <div
              class="h-24 w-24 rounded-full border-4 border-white bg-white dark:border-gray-900 dark:bg-gray-900"
            >
              <div
                class="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white"
              >
                A
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="px-6 pb-6 pt-16">
          <div class="mb-4 flex items-start justify-between">
            <div>
              <h1 class="text-xl font-bold">Alex Chen</h1>
              <p class="text-gray-600 dark:text-gray-400">
                Senior Frontend Developer at Tech Innovations
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
                San Francisco Bay Area · 500+ connections
              </p>
            </div>
            <button
              class="rounded-full border border-blue-600 px-3 py-1 text-sm font-medium text-blue-600 dark:border-blue-500 dark:text-blue-400"
              >Connect</button
            >
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium text-blue-600 dark:text-blue-400">Open to work</span>
            <span>·</span>
            <span>Frontend Developer roles</span>
          </div>
        </div>
      </div>

      <!-- Featured Section -->
      <div
        class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">Featured</h2>
          <button class="text-xs text-gray-500 dark:text-gray-400">Edit</button>
        </div>

        <!-- Memsched widget as LinkedIn featured post -->
        <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <!-- Featured header with memsched logo -->
          <div
            class="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                >
                  <Icon src={FiFileText} size="18" />
                </div>
                <div>
                  <h3 class="font-medium">My Learning Dashboard</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Powered by memsched · Updated weekly
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Memsched widget content -->
          <div class="p-4 dark:bg-gray-900">
            <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
              Showcasing my continuous learning journey. I believe in transparency and sharing my
              growth with my network.
            </p>

            <!-- Learning Progress Overview -->
            <div
              class="mb-4 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/30 dark:to-indigo-900/30"
            >
              <div class="mb-2 flex items-center justify-between">
                <h4 class="text-sm font-medium">Learning Progress Overview</h4>
                <span
                  class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                  >3 active courses</span
                >
              </div>

              <!-- First skill -->
              <div class="mb-3">
                <div class="mb-1 flex items-center justify-between text-xs">
                  <span class="font-medium">React & Modern JavaScript</span>
                  <span class="text-blue-700 dark:text-blue-400">89%</span>
                </div>
                <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    style="width: 89%"
                  ></div>
                </div>
              </div>

              <!-- Second skill -->
              <div class="mb-3">
                <div class="mb-1 flex items-center justify-between text-xs">
                  <span class="font-medium">UI/UX Design Principles</span>
                  <span class="text-blue-700 dark:text-blue-400">65%</span>
                </div>
                <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    style="width: 65%"
                  ></div>
                </div>
              </div>

              <!-- Third skill -->
              <div>
                <div class="mb-1 flex items-center justify-between text-xs">
                  <span class="font-medium">Cloud Architecture</span>
                  <span class="text-blue-700 dark:text-blue-400">42%</span>
                </div>
                <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    style="width: 42%"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Statistics -->
            <div class="mb-3 grid grid-cols-3 gap-3">
              <div class="rounded-md bg-gray-50 p-3 text-center dark:bg-gray-800">
                <div class="text-lg font-bold text-gray-900 dark:text-gray-100">728</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Hours Invested</div>
              </div>
              <div class="rounded-md bg-gray-50 p-3 text-center dark:bg-gray-800">
                <div class="text-lg font-bold text-gray-900 dark:text-gray-100">24</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Projects</div>
              </div>
              <div class="rounded-md bg-gray-50 p-3 text-center dark:bg-gray-800">
                <div class="text-lg font-bold text-gray-900 dark:text-gray-100">8</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Certificates</div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <a
                href="#"
                class="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400"
              >
                <span>View full learning journey</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg
                >
              </a>
              <div class="text-xs text-gray-500 dark:text-gray-400">Powered by memsched</div>
            </div>
          </div>
        </div>

        <!-- LinkedIn post engagement -->
        <div
          class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700"
        >
          <div class="flex items-center gap-2">
            <div class="flex -space-x-1">
              <div
                class="h-5 w-5 rounded-full border border-white bg-blue-100 dark:border-gray-900 dark:bg-blue-800"
              ></div>
              <div
                class="h-5 w-5 rounded-full border border-white bg-green-100 dark:border-gray-900 dark:bg-green-800"
              ></div>
              <div
                class="h-5 w-5 rounded-full border border-white bg-red-100 dark:border-gray-900 dark:bg-red-800"
              ></div>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">John Doe and 42 others</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>18 comments</span>
            <span>7 shares</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</BrowserLayout>

<style>
  .linkedin-content {
    background-color: white;
  }

  :global(.dark) .linkedin-content {
    background-color: #111827; /* dark:bg-gray-900 */
  }
</style>
