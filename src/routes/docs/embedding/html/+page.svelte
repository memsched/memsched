<script lang="ts">
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/state';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import * as Alert from '$lib/components/ui/alert';

  const pageTitle = 'HTML & Markdown Embedding Guide - MEMsched Documentation';
  const pageDescription =
    'Learn how to embed your MEMsched widgets using HTML or Markdown. Step-by-step guide with code examples and customization options.';

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
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    type: 'article',
  }}
  twitter={{
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
    site: '@memsched',
  }}
/>

<div class="space-y-8">
  <div class="space-y-4">
    <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">HTML & Markdown Embedding</h1>
    <p class="text-xl text-muted-foreground">
      Learn how to embed your MEMsched widget using HTML or Markdown.
    </p>
  </div>

  <Alert.Root>
    <Alert.Description>
      Before embedding your widget, make sure you have created a <strong>public widget</strong> in your
      dashboard. Each widget has its unique URL that you'll use in the code snippets below.
    </Alert.Description>
  </Alert.Root>

  <div class="space-y-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
      HTML and Markdown Embedding
    </h2>
    <p>
      You can embed your widget in any HTML page or Markdown document. You can decide to link the
      widget to your profile or not.
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
  </div>

  <div class="space-y-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
      Customization Options
    </h2>
    <p>You can customize how your widget appears by adding parameters to the widget URL:</p>
    <ul class="list-disc space-y-2 pl-6">
      <li><code>height</code> - Adjust the height of the widget (default: 80px)</li>
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
          <strong>Styling conflicts:</strong> Try using <code>style="height: 80px"</code> instead of
          the <code>height="80"</code> parameter
        </li>
      </ul>
    </div>
  </div>
</div>
