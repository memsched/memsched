import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from './$types';

export async function POST(event: RequestEvent): Promise<Response> {
  // Get the webhook signature from the headers
  const signature = event.request.headers.get('stripe-signature');
  if (!signature) {
    throw error(400, 'Missing stripe-signature header');
  }

  // Get the webhook secret from environment variables
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw error(500, 'Stripe webhook secret is not configured');
  }

  // Get the raw body as text
  const payload = await event.request.text();

  try {
    // Validate and process the webhook
    const result = await event.locals.paymentService.validateAndProcessWebhook(
      payload,
      signature,
      webhookSecret
    );

    if (result.isErr()) {
      console.error('Error processing webhook:', result.error);
      throw error(400, 'Error processing webhook');
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    console.error('Webhook error:', err);
    throw error(400, err.message || 'Webhook Error');
  }
}
