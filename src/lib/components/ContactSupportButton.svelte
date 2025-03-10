<script lang="ts">
  import { Button } from './ui/button';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
</script>

<Button variant="outline" class={className} href="mailto:info@memsched.com">Contact Support</Button>
