<script lang="ts">
  import { page } from '$app/state';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { Alert } from '$lib/components/ui/alert';

  // Example widget for documentation
  const exampleWidgetUrl = `${page.url.origin}/api/widgets/example`;
  const exampleUserUrl = `${page.url.origin}/johndoe`;
  const exampleTitle = 'Learning Progress';

  const htmlSnippet = `<a href="${exampleUserUrl}" target="_blank">
    <img src="${exampleWidgetUrl}?svg" 
         alt="${exampleTitle}"
         height="80"
    />
</a>`;

  const htmlSnippetNoLink = `<img src="${exampleWidgetUrl}?svg" 
     alt="${exampleTitle}"
     height="80"
/>`;

  const markdownSnippet = `[![${exampleTitle}](${exampleWidgetUrl}?svg)](${exampleUserUrl})`;
</script>

<div class="space-y-8">
  <div class="space-y-4">
    <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">HTML & Markdown Embedding</h1>
    <p class="text-xl text-muted-foreground">
      Learn how to embed your MEMsched widget using HTML or Markdown.
    </p>
  </div>

  <Alert>
    <p>
      Before embedding your widget, make sure you have created one in your dashboard. Each widget
      has its unique URL that you'll use in the code snippets below.
    </p>
  </Alert>

  <div class="space-y-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">HTML Embedding</h2>
    <p>
      You can embed your widget in any HTML page. We provide two options: with or without a link to
      your profile.
    </p>

    <div class="space-y-4">
      <h3 class="text-2xl font-semibold tracking-tight">With Profile Link</h3>
      <p>
        This option wraps your widget in a link that directs users to your MEMsched profile when
        clicked:
      </p>
      <CodeBlock code={htmlSnippet} />
    </div>

    <div class="space-y-4">
      <h3 class="text-2xl font-semibold tracking-tight">Without Profile Link</h3>
      <p>Use this option if you want to display the widget without making it clickable:</p>
      <CodeBlock code={htmlSnippetNoLink} />
    </div>

    <div class="space-y-4">
      <h3 class="text-2xl font-semibold tracking-tight">Common Use Cases</h3>
      <ul class="list-disc space-y-2 pl-6">
        <li>Personal websites and portfolios</li>
        <li>Blog posts and articles</li>
        <li>Company websites</li>
        <li>Educational platforms</li>
      </ul>
    </div>
  </div>

  <div class="space-y-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
      Markdown Embedding
    </h2>
    <p>
      For platforms that use Markdown (like GitHub READMEs, wikis, or documentation), you can use
      our Markdown syntax:
    </p>

    <CodeBlock code={markdownSnippet} />

    <div class="space-y-4">
      <h3 class="text-2xl font-semibold tracking-tight">Popular Platforms</h3>
      <ul class="list-disc space-y-2 pl-6">
        <li>GitHub Profile README</li>
        <li>GitLab Wikis</li>
        <li>Notion Pages</li>
        <li>Documentation Sites</li>
      </ul>
    </div>
  </div>

  <div class="space-y-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
      Customization Options
    </h2>
    <p>You can customize how your widget appears by adding parameters to the widget URL:</p>
    <ul class="list-disc space-y-2 pl-6">
      <li><code>height</code> - Adjust the height of the widget (default: 80px)</li>
      <li><code>theme</code> - Switch between light and dark themes (if available)</li>
      <li>
        <code>style</code> - Apply custom styles (see
        <a href="/docs/customization/styling" class="text-primary hover:underline"
          >styling documentation</a
        >)
      </li>
    </ul>
  </div>

  <div class="space-y-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Troubleshooting</h2>
    <div class="space-y-4">
      <h3 class="text-2xl font-semibold tracking-tight">Common Issues</h3>
      <ul class="list-disc space-y-2 pl-6">
        <li>
          <strong>Widget not displaying:</strong> Ensure the widget URL is correct and your widget is
          public
        </li>
        <li>
          <strong>Wrong size:</strong> Check if you've specified the correct height value
        </li>
        <li>
          <strong>Styling conflicts:</strong> Try using the iframe embedding method instead
        </li>
      </ul>
    </div>
  </div>
</div>
