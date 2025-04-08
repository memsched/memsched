<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';

  import { page } from '$app/state';

  const origin = page.url.origin;
  const source = `
_Effective Date: March 23, 2025_

Welcome to MEMsched. By accessing or using our website (${origin}), you agree to comply with and be bound by the following Terms of Service. Please read these carefully.

## 1. Services

MEMsched is a web app that allows users to track their objectives and create sharable widgets to showcase their progress.

## 2. Subscriptions and Payments

### 2.1 Subscription Plans

When you purchase a subscription, you gain access to premium features. Our subscription plans are:
- **Free Plan:** Basic features with limited objectives and widgets
- **Pro Plan:** Unlimited objectives, widgets, and premium features

### 2.2 Payment Processing

- All payments are processed securely through Stripe, our payment processor
- Subscription fees are charged in advance on a monthly basis
- You agree to maintain valid payment information for your subscription

### 2.3 Cancellation and Refunds

- You may cancel your subscription at any time through your account settings
- Cancellations take effect at the end of your current billing period
- You may request a full refund within 7 days of purchase by contacting [info@memsched.com](mailto:info@memsched.com)
- No refunds are provided for partial months of service

## 3. Account Management

### 3.1 Account Creation

You may create an account using:
- GitHub OAuth: Using your GitHub account
- Google OAuth: Using your Google account

Both methods require you to grant access to your basic profile information, which is used solely for account creation and management.

### 3.2 Account Deletion

You may delete your account at any time through your account settings. When you delete your account:

1. Your subscription will be cancelled immediately
2. Your personal information will be anonymized
3. Your objectives and widgets will be deleted
4. Minimal data will be retained for 30 days for legal purposes
5. After 30 days, all remaining data will be permanently deleted
6. Payment records will be retained as required by law

Account deletion is permanent and cannot be undone.

## 4. Third-Party Integrations

MEMsched may allow users to connect third-party services to enhance functionality. By opting in, you grant us permission to access data from these services solely for the specified purposes.

### 4.1 OAuth Authentication

For authentication, we use OAuth services with the following scopes:
- **GitHub**: We request access to your email address (scope: user:email) to create and verify your account.
- **Google**: We request access to your basic profile information (scopes: openid, profile, email) to create and verify your account.

All data accessed through these services is handled in accordance with our Privacy Policy.

## 5. User Data and Privacy

We collect and process data in accordance with our [Privacy Policy](${origin}/privacy). By using our services, you agree to:

1. The collection and processing of your data as described in the Privacy Policy
2. The use of cookies for authentication and functionality
3. The processing of your payment information by Stripe

## 6. Updates to the Terms

We may update these Terms from time to time. Users will be notified of any changes via email.

## 7. Governing Law

These Terms are governed by and construed in accordance with the laws of Switzerland, without regard to its conflict of law principles. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Switzerland.

## 8. Data Protection

We process personal data in accordance with the Swiss Federal Act on Data Protection (FADP) and, where applicable, the EU General Data Protection Regulation (GDPR).

## 9. Contact Information

If you have any questions or concerns, please contact us at [info@memsched.com](mailto:info@memsched.com).

Thank you for using MEMsched!`;

  // Our registered address is:
  // MEMsched
  // [Your Swiss Address]
  // Switzerland
</script>

<SvelteMarkdown {source} />
