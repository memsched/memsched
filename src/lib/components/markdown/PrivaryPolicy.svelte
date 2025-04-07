<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';

  import { page } from '$app/state';

  const origin = page.url.origin;
  const source = `
_Effective Date: March 23, 2025_

Your privacy is important to us. It is MEMsched's policy to respect your privacy regarding any information we may collect from you across our website, ${origin}, and other sites we own and operate.

## 1. Information We Collect

We collect information through the following means:

### 1.1 OAuth Authentication
When you sign in using GitHub or Google, we collect:
- Your email address
- Your name
- Your profile picture (optional)
- A unique identifier from the authentication provider

### 1.2 Service Usage
When you use our service, we collect:
- Objectives and widgets data you create
- Usage analytics (anonymized)
- Performance metrics

### 1.3 Payment Information
When you subscribe to our Pro plan:
- Stripe, our payment processor, collects and processes your payment information
- We never store your complete payment details
- We maintain subscription and transaction records as required by law

## 2. How We Use Your Information

We use your information for:
- Account creation and management
- Processing payments and managing subscriptions
- Providing and improving our services
- Sending important service notifications
- Analytics to improve user experience (anonymized)

## 3. Data Sharing and Third-Party Services

We share minimal required data with:

### 3.1 Payment Processing
- **Stripe:** Processes payments and manages subscriptions
  - Receives: Payment information, email
  - Purpose: Payment processing, subscription management
  - Privacy Policy: [Stripe Privacy Policy](https://stripe.com/privacy)

### 3.2 Authentication Providers
- **GitHub:**
  - Receives: Authentication request
  - Accesses: Email address (scope: user:email)
  - Purpose: Account creation and verification

- **Google:**
  - Receives: Authentication request
  - Accesses: Basic profile (scopes: openid, profile, email)
  - Purpose: Account creation and verification

We do not sell or share your personal data with any other third parties.

## 4. Data Storage and Security

- Our servers are located in Europe
- Data is encrypted in transit and at rest
- We implement industry-standard security measures
- Regular security audits and updates are performed

## 5. Your Privacy Rights

Under Swiss data protection law (FADP), you have the right to:
- Access your personal data
- Correct inaccurate data
- Request data deletion
- Export your data
- Withdraw consent
- Lodge complaints with the Swiss FDPIC

## 6. Account Deletion and Data Retention

When you delete your account:

### 6.1 Immediate Actions
- Personal information is anonymized
- Active subscriptions are cancelled
- Objectives and widgets are deleted
- Stripe customer profile is scheduled for deletion

### 6.2 Data Retention
- Anonymized data is retained for 30 days
- After 30 days, all user data is permanently deleted
- Payment records are retained as required by law
- Analytics data remains anonymized

### 6.3 Exceptions
- Financial records (as required by law)
- Aggregate analytics (anonymized)
- Logs required for security purposes

## 7. Cookies and Tracking

We use:
- Essential cookies for authentication
- Session management cookies
- [Umami Analytics](https://umami.is) for anonymous usage statistics
- No third-party tracking cookies

## 8. Children's Privacy

MEMsched does not knowingly collect information from children under 16. If you believe a child has provided us data, contact us for immediate removal.

## 9. Changes to This Policy

We may update this policy. You will be notified of significant changes via:
- Email notification
- Website announcement
- Service notification

## 10. Contact Information

For privacy inquiries:
- Email: [info@memsched.com](mailto:info@memsched.com)
- Subject: "Privacy Concern"

## 11. Legal Compliance

We comply with:
- Swiss Federal Act on Data Protection (FADP)
- EU General Data Protection Regulation (GDPR) where applicable
- Financial services regulations regarding payment processing

For complaints, contact the Swiss Federal Data Protection and Information Commissioner (FDPIC).`;

  // Our registered address is:
  // MEMsched
  // [Your Swiss Address]
  // Switzerland
</script>

<SvelteMarkdown {source} />
