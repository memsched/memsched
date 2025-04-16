<div class="space-y-8">
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Styling & Customization</h1>
  <p class="text-xl text-muted-foreground">
    Customize the appearance and dimensions of your MEMsched widget using URL parameters.
  </p>

  <div class="space-y-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
      Widget URL Parameters
    </h2>
    <p>You can customize how your widget appears by adding query parameters to the widget URL:</p>

    <div class="space-y-4">
      <h3 class="text-2xl font-semibold tracking-tight">Dark Mode</h3>
      <p>
        You can enable a dark theme for your widget by adding the <code
          class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">dark</code
        > query parameter to the widget URL. This is useful when embedding the widget on pages with a
        dark background.
      </p>
      <p>
        Simply append <code
          class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">?dark</code
        >
        (if it's the first parameter) or
        <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
          >&dark</code
        >
        (if other parameters exist) to the URL. Note that <code>?dark=1</code> is also valid.
      </p>

      <h4 class="mt-4 text-xl font-semibold tracking-tight">Example:</h4>
      <pre class="mt-2 overflow-x-auto rounded-md border bg-muted p-4 font-mono text-sm"><code
          >&lt;img src="https://memsched.com/api/widgets/[YOUR_WIDGET_ID]?svg<span
            class="font-bold text-primary">&dark</span
          >" alt="MEMsched Widget"&gt;</code
        ></pre>
    </div>

    <div class="space-y-4">
      <h3 class="text-2xl font-semibold tracking-tight">Height</h3>
      <p>
        Adjust the height of the widget image using the <code>height</code> attribute on the
        <code>&lt;img&gt;</code> tag.
      </p>
      <ul class="list-disc space-y-2 pl-6">
        <li>
          Using HTML attribute: <code
            class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
            >&lt;img src="..." height="100"&gt;</code
          > (Sets height to 100px, default is 80px).
        </li>
      </ul>
      <p class="text-sm text-muted-foreground">
        Note: Using the HTML attribute is the recommended way to set the widget height.
      </p>
    </div>
  </div>

  <div class="space-y-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Troubleshooting</h2>
    <div class="space-y-4">
      <h3 class="text-2xl font-semibold tracking-tight">Common Styling Issues</h3>
      <ul class="list-disc space-y-2 pl-6">
        <li>
          <strong>Widget not displaying expected size:</strong> Ensure you've set the
          <code>height</code>
          attribute correctly on the <code>&lt;img&gt;</code> tag. Check for conflicting CSS rules on
          your page.
        </li>
        <li>
          <strong>Styling conflicts with page CSS:</strong> If the widget size set by the
          <code>height</code>
          attribute isn't working, try using inline CSS:
          <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
            >style="height: 80px;"</code
          >
          on the <code>&lt;img&gt;</code> tag. This often overrides conflicting styles.
        </li>
      </ul>
    </div>
  </div>
</div>
