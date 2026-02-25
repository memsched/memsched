<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { BsLinkedin, BsTwitterX } from 'svelte-icons-pack/bs';
  import { IoInformationCircle } from 'svelte-icons-pack/io';
  import { v4 as uuidv4 } from 'uuid';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';
  import * as Tabs from '$lib/components/ui/tabs';

  import CodeBlock from './CodeBlock.svelte';
  import CopyButton from './CopyButton.svelte';

  interface Props {
    title: string;
    subtitle: string | null;
    username: string;
    widgetDark?: boolean;
  }

  const { title, subtitle, username, widgetDark = false }: Props = $props();

  const userUrl = $derived(page.url.origin + '/' + username);
  const widgetUrl = $derived(page.url.origin + '/api/widgets/' + page.params.id);

  const widgetShareUrl = $derived(
    userUrl + '?w=' + page.params.id + (widgetDark ? '&dark' : '') + '&r=' + uuidv4()
  );

  // Construct the Twitter share URL
  const twitterText = `What I'm learning right now:\n\n`;
  const twitterShareUrl = $derived(
    `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(
      widgetShareUrl
    )}`
  );

  // Construct the LinkedIn share URL
  const linkedInShareUrl = $derived(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(widgetShareUrl)}`
  );

  let includeProfileLink = $state(true);

  // HTML snippet with anchor tag
  const htmlSnippet = $derived(
    `<a href="${userUrl}" target="_blank" rel="noopener noreferrer">
    <img src="${widgetUrl}?f=svg${widgetDark ? '&dark' : ''}"
         alt="${title}${subtitle ? ' - ' + subtitle : ''}"
         style="width: fit-content; height: fit-content;"
    />
</a>`.trim()
  );

  // HTML snippet without anchor tag
  const htmlSnippetNoLink = $derived(
    `<img src="${widgetUrl}?f=svg${widgetDark ? '&dark' : ''}"
     alt="${title}${subtitle ? ' - ' + subtitle : ''}"
     style="width: fit-content; height: fit-content;"
/>`.trim()
  );
</script>

<div class="space-y-4">
  <div class="bg-secondary flex items-center gap-3 rounded-lg border p-3 text-sm">
    <Icon src={IoInformationCircle} className="mt-0.5 size-5 flex-shrink-0 text-muted-foreground" />
    <div class="space-y-1">
      <p>
        For detailed setup instructions and troubleshooting, check out our
        <a
          href={resolve('/docs/embedding/html')}
          class="text-primary hover:underline"
          data-sveltekit-reload>widget documentation</a
        >.
      </p>
    </div>
  </div>

  <Tabs.Root value="html" class="space-y-4">
    <Tabs.Content value="html" class="space-y-4">
      <div class="flex items-center space-x-2">
        <Switch id="profile-link" bind:checked={includeProfileLink} />
        <Label for="profile-link">Include Profile Link</Label>
      </div>
      <div class="space-y-2">
        <CodeBlock code={includeProfileLink ? htmlSnippet : htmlSnippetNoLink} language="html" />
      </div>
      <p class="text-muted-foreground text-sm">
        Copy the code above and paste it into your HTML website or blog.
      </p>
    </Tabs.Content>
  </Tabs.Root>
  <div class="bg-border h-px w-full"></div>
  <div class="mt-4 flex gap-2">
    <CopyButton textToCopy={widgetShareUrl} label="Copy Link" />
    <Button href={twitterShareUrl} target="_blank" rel="noopener noreferrer" variant="outline">
      <Icon src={BsTwitterX} className="mr-2 size-4" />
      Share on X
    </Button>
    <Button href={linkedInShareUrl} target="_blank" rel="noopener noreferrer" variant="outline">
      <Icon src={BsLinkedin} className="mr-2 size-4" />
      Share on LinkedIn
    </Button>
  </div>
</div>
