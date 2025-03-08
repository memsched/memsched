<script lang="ts">
  import { page } from '$app/state';
  import CodeBlock from './CodeBlock.svelte';

  interface Props {
    title: string;
    subtitle: string | null;
    username: string;
  }

  const { title, subtitle, username }: Props = $props();

  const userUrl = page.url.origin + '/' + username;
  const widgetUrl = page.url.origin + '/api/widgets/' + page.params.id;
  const htmlSnippet = $derived(
    `
<a href="${userUrl}" target="_blank">
    <img src="${widgetUrl}?svg" 
         alt="${title}${subtitle ? ' - ' + subtitle : ''}"
         loading="eager"
         height="80px"
    />
</a>
`.trim()
  );
</script>

<div class="space-y-2">
  <CodeBlock code={htmlSnippet} />
  <div class="text-sm text-muted-foreground">
    Copy the code above and paste it into your markdown or website.
  </div>
</div>
