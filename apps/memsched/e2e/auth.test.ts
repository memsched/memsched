import { expect, test } from '@playwright/test';

test('signin page should display auth providers and terms info', async ({ page }) => {
  await page.goto('/auth/signin');

  // Check for auth provider buttons
  await expect(page.getByText('Continue with Google')).toBeVisible();
  await expect(page.getByText('Continue with Github')).toBeVisible();

  // Check for terms of service links
  await expect(page.getByText('Terms of Service', { exact: false })).toBeVisible();
  await expect(page.getByText('Privacy Policy', { exact: false })).toBeVisible();

  // Verify SEO metadata is correct
  const title = await page.title();
  expect(title).toContain('Sign in to MEMsched');
});

test('GitHub auth button should navigate to correct OAuth endpoint', async ({ page }) => {
  await page.goto('/auth/signin');

  // Intercept navigation to GitHub
  const navigationPromise = page.waitForRequest((request) =>
    request.url().includes('/auth/signin/github')
  );

  // Click the GitHub sign-in button
  await page.getByText('Continue with Github').click();

  // Wait for the request
  const request = await navigationPromise;

  // Verify the URL is correct and includes the expected path
  expect(request.url()).toContain('/auth/signin/github');
});

test('Google auth button should navigate to correct OAuth endpoint', async ({ page }) => {
  await page.goto('/auth/signin');

  // Intercept navigation to Google
  const navigationPromise = page.waitForRequest((request) =>
    request.url().includes('/auth/signin/google')
  );

  // Click the Google sign-in button
  await page.getByText('Continue with Google').click();

  // Wait for the request
  const request = await navigationPromise;

  // Verify the URL is correct and includes the expected path
  expect(request.url()).toContain('/auth/signin/google');
});

test('OAuth callback routes should enforce security', async ({ page }) => {
  // Test the GitHub OAuth callback route
  const response = await page.goto('/auth/signin/github/callback?code=test&state=test');

  // Either we hit a rate limit (429) or an authentication error
  const status = response?.status() || 0;

  // Status should be an error (either rate limit or auth error)
  expect(status).toBeGreaterThanOrEqual(400);

  // If it's a rate limit error, verify the message
  if (status === 429) {
    const content = await page.content();
    expect(content).toContain('Too many requests');
  }
});

test('signout route should be protected', async ({ page }) => {
  // Test the signout route by making a POST request to /auth/signout and getting a 401
  const response = await page.request.post('/auth/signout', {
    form: {},
  });
  expect(response?.status()).toBe(403);
});
