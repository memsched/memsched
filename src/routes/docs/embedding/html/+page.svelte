<script lang="ts">
  import { page } from '$app/state';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import * as Alert from '$lib/components/ui/alert';

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

    <p class="mt-4">
      For customization options like dark mode or adjusting the height, please refer to the
      <a href="/docs/customization/styling" class="text-primary hover:underline"
        >Styling & Customization</a
      > page.
    </p>
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
          <strong>Wrong size:</strong> Check the
          <a href="/docs/customization/styling" class="text-primary hover:underline"
            >Styling & Customization</a
          > page for details on setting the height.
        </li>
      </ul>
    </div>
  </div>
</div>
