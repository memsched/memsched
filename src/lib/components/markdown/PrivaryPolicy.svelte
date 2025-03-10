<script lang="ts">
  import { page } from '$app/state';
  import SvelteMarkdown from 'svelte-markdown';

  const origin = page.url.origin;
  const source = `
_Effective Date: March 10, 2025_

Your privacy is important to us. It is MEMsched's policy to respect your privacy regarding any information we may collect from you across our website, ${origin}, and other sites we own and operate.

## 1. Information We Collect

We collect both personal and non-personal information for the following purposes:

- **Personal Data:** We may ask for your name, email address, and payment information to process your orders.
- **Non-Personal Data:** We use web cookies for authentication and functionality purposes.

## 2. Data Usage

We use the personal information collected only for processing orders and providing you with the services you request. Non-personal data helps enhance the website's functionality and user experience.

## 3. Data Sharing

We do not share your personal data with any third parties.

## 4. Third-Party Services and OAuth Integration

MEMsched offers integration with third-party services to enhance your experience:

### 4.1 Authentication Services

We use third-party OAuth authentication services to provide secure login options:

- **GitHub OAuth:** When you sign in with GitHub, we request access to your email address (scope: user:email). This is used solely to create and manage your account.

- **Google OAuth:** When you sign in with Google, we request access to your basic profile information (scopes: openid, profile, email). This is used solely to create and manage your account.

## 5. Legal Basis for Processing (Swiss FADP)

In accordance with the Swiss Federal Act on Data Protection (FADP), we process your personal data based on the following legal grounds:

- Your consent when you agree to this Privacy Policy
- The fulfillment of our contractual obligations to you
- Compliance with legal obligations
- Our legitimate interests, which do not override your fundamental rights and freedoms

## 6. Data Transfer and Storage

Our servers are located in Europe. By using our services, you consent to the transfer of your data to these servers. We implement appropriate safeguards to protect your information during transfer and storage.

## 7. Your Rights

Under Swiss data protection law, you have the following rights:

- The right to access your personal data
- The right to rectify inaccurate personal data
- The right to erasure ("right to be forgotten")
- The right to restrict processing
- The right to data portability
- The right to object to processing
- The right to withdraw consent

To exercise these rights, please contact us at [info@memsched.com](mailto:info@memsched.com).

## 8. Children's Privacy

MEMsched does not knowingly collect any personal information from children under the age of 16.

## 9. Cookies

MEMsched uses web cookies strictly for authentication and functionality purposes. These cookies help ensure a smooth user experience by allowing you to remain logged in and access our services securely. We do not use cookies for tracking or collecting any non-personal data related to your browsing behavior.

In addition, we use [Umami Web Analytics](https://umami.is) to monitor website activity and performance. This helps us analyze traffic patterns and scale our services effectively to meet user demand. Umami is a privacy-focused analytics platform that does not create cookies and does not track personal information or browsing behavior across other sites. All analytics data is collected anonymously.

## 10. Privacy Policy Updates

We may update our Privacy Policy from time to time. If significant changes occur, we will notify you via email.

## 11. Supervisory Authority

If you believe that our processing of your personal data infringes data protection laws, you have the right to lodge a complaint with the Swiss Federal Data Protection and Information Commissioner (FDPIC).

## 12. Contact Us

For any questions or concerns regarding this policy, please contact us at [info@memsched.com](mailto:info@memsched.com).

By using our services, you consent to the collection and use of your information as described in this Privacy Policy.`;

  // Our registered address is:
  // MEMsched
  // [Your Swiss Address]
  // Switzerland
</script>

<SvelteMarkdown {source} />
