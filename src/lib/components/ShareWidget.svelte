<script lang="ts">
  import { page } from '$app/state';
  import CodeBlock from './CodeBlock.svelte';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Icon } from 'svelte-icons-pack';
  import { IoInformationCircle } from 'svelte-icons-pack/io';
  import { Switch } from '$lib/components/ui/switch';
  import { Label } from '$lib/components/ui/label';

  interface Props {
    title: string;
    subtitle: string | null;
    username: string;
  }

  const { title, subtitle, username }: Props = $props();

  const userUrl = page.url.origin + '/' + username;
  const widgetUrl = page.url.origin + '/api/widgets/' + page.params.id;

  let includeProfileLink = $state(true);

  // HTML snippet with anchor tag
  const htmlSnippet = $derived(
    `<a href="${userUrl}" target="_blank">
    <img src="${widgetUrl}?svg" 
         alt="${title}${subtitle ? ' - ' + subtitle : ''}"
         height="80"
    />
</a>`.trim()
  );

  // HTML snippet without anchor tag
  const htmlSnippetNoLink = $derived(
    `<img src="${widgetUrl}?svg" 
     alt="${title}${subtitle ? ' - ' + subtitle : ''}"
     height="80"
/>`.trim()
  );

  // WordPress shortcode
  //   const wordpressSnippet = $derived(
  //     `[memsched_widget url="${widgetUrl}?svg" title="${title}${subtitle ? ' - ' + subtitle : ''}" link="${userUrl}"]`.trim()
  //   );

  //   // iFrame snippet
  //   const iframeSnippet = $derived(
  //     `<iframe src="${widgetUrl}?svg"
  //      title="${title}${subtitle ? ' - ' + subtitle : ''}"
  //      width="100%"
  //      height="100"
  //      frameborder="0"
  //      scrolling="no"
  //      style="max-width: 400px;"
  // ></iframe>`.trim()
  //   );
</script>

<div class="space-y-4">
  <div class="flex items-center gap-3 rounded-lg border bg-muted p-3 text-sm">
    <Icon src={IoInformationCircle} className="mt-0.5 size-5 flex-shrink-0 text-muted-foreground" />
    <div class="space-y-1">
      <p>
        For detailed setup instructions and troubleshooting, check out our <a
          href="/docs/embedding/html"
          class="text-primary hover:underline">widget documentation</a
        >.
      </p>
    </div>
  </div>

  <Tabs.Root value="html" class="space-y-4">
    <!-- <Tabs.List>
      <Tabs.Trigger value="html">HTML or Markdown</Tabs.Trigger>
      <Tabs.Trigger value="wordpress">WordPress</Tabs.Trigger>
      <Tabs.Trigger value="iframe">iFrame</Tabs.Trigger>
    </Tabs.List> -->

    <Tabs.Content value="html" class="space-y-4">
      <div class="flex items-center space-x-2">
        <Switch id="profile-link" bind:checked={includeProfileLink} />
        <Label for="profile-link">Include Profile Link</Label>
      </div>
      <div class="space-y-2">
        <CodeBlock code={includeProfileLink ? htmlSnippet : htmlSnippetNoLink} />
      </div>
      <p class="text-sm text-muted-foreground">
        Copy the code above and paste it into your HTML website or blog.
      </p>
    </Tabs.Content>

    <!-- <Tabs.Content value="wordpress" class="space-y-4">
      <div class="space-y-4">
        <CodeBlock code={wordpressSnippet} />
        <p class="text-sm text-muted-foreground">
          To use this shortcode, first install our WordPress plugin from the
          <a href="/docs/wordpress" class="text-primary hover:underline">WordPress setup guide</a>.
        </p>
      </div>
    </Tabs.Content>

    <Tabs.Content value="iframe" class="space-y-4">
      <CodeBlock code={iframeSnippet} />
      <p class="text-sm text-muted-foreground">
        Use iFrame embedding when you need more control over the widget's display or when other
        methods aren't available.
      </p>
    </Tabs.Content> -->
  </Tabs.Root>
</div>
