<script lang="ts">
  import { page } from '$app/state';
  import SvelteMarkdown from 'svelte-markdown';

  const origin = page.url.origin;
  const source = `
_Effective Date: March 10, 2025_

Welcome to MEMsched. By accessing or using our website (${origin}), you agree to comply with and be bound by the following Terms of Service. Please read these carefully.

## 1. Services

MEMsched is a web app that allows users to track their objectives and create sharable widgets to showcase their progress.

## 2. Subscriptions and Refunds

When you purchase a subscription, you gain access to premium features. You may request a full refund within 7 days of purchase by contacting [info@memsched.com](mailto:info@memsched.com).

## 3. Third-Party Integrations

MEMsched may allow users to connect third-party services to enhance functionality. By opting in, you grant us permission to access data from these services solely for the specified purposes.

### 3.1 OAuth Authentication

For authentication, we use OAuth services with the following scopes:
- **GitHub**: We request access to your email address (scope: user:email) to create and verify your account.
- **Google**: We request access to your basic profile information (scopes: openid, profile, email) to create and verify your account.

All data accessed through these services is handled in accordance with our Privacy Policy.

## 4. User Data Collection and Cookies

We collect data to provide services. Please refer to our [Privacy Policy](${origin}/privacy) for details on how we handle your data, including cookie usage.

## 5. Updates to the Terms

We may update these Terms from time to time. Users will be notified of any changes via email.

## 6. Governing Law

These Terms are governed by and construed in accordance with the laws of Switzerland, without regard to its conflict of law principles. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Switzerland.

## 7. Data Protection

We process personal data in accordance with the Swiss Federal Act on Data Protection (FADP) and, where applicable, the EU General Data Protection Regulation (GDPR).

## 8. Contact Information

If you have any questions or concerns, please contact us at [info@memsched.com](mailto:info@memsched.com).

Thank you for using MEMsched!`;

  // Our registered address is:
  // MEMsched
  // [Your Swiss Address]
  // Switzerland
</script>

<SvelteMarkdown {source} />
