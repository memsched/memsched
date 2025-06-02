/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
