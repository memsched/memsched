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
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { generateSetInitialModeExpression } from 'mode-watcher';

import { building } from '$app/environment';
import { getAvatarStore } from '$lib/server/avatar-store';
import { getCache } from '$lib/server/cache';
import { type DBType, getDB } from '$lib/server/db';
import {
  MetricDataService,
  ModerationService,
  ObjectiveLogsService,
  ObjectivesService,
  PaymentService,
  SESSION_COOKIE_NAME,
  SessionsService,
  UsersService,
  WidgetsService,
} from '$lib/server/services';
import { getStore } from '$lib/server/store';

const PRERENDERED_ROUTES: string[] = [];

function isPrerenderedRoute(url: URL) {
  return PRERENDERED_ROUTES.some((route) => url.pathname.startsWith(route));
}

/**
 * Initializes all services using dependency injection
 * This pattern avoids circular dependencies by creating all service instances
 * with their dependencies
 */
function initializeServices(db: DBType) {
  // Create independent services first
  const usersService = new UsersService(db);

  const objectivesService = new ObjectivesService(db);
  const objectiveLogsService = new ObjectiveLogsService(db, objectivesService);

  const metricDataService = new MetricDataService(db, objectivesService, objectiveLogsService);
  const widgetsService = new WidgetsService(db, objectivesService, metricDataService);
  objectiveLogsService.setWidgetsService(widgetsService);

  const sessionsService = new SessionsService(db);
  const paymentService = new PaymentService(db);
  const moderationService = new ModerationService();

  return {
    usersService,
    objectivesService,
    objectiveLogsService,
    widgetsService,
    metricDataService,
    sessionsService,
    paymentService,
    moderationService,
  };
}

// This will handle database injection
const dbHandle: Handle = async ({ event, resolve }) => {
  if (building || isPrerenderedRoute(event.url)) {
    return resolve(event);
  }

  // Make database available via event.platform
  event.locals.db = getDB(event.platform) as DBType;
  event.locals.cache = getCache(event.platform);
  event.locals.store = getStore(event.platform);
  event.locals.avatarStore = getAvatarStore(event.platform);
  const services = initializeServices(event.locals.db);
  Object.assign(event.locals, services);

  return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
  if (building || isPrerenderedRoute(event.url)) {
    return resolve(event);
  }

  const token = event.cookies.get(SESSION_COOKIE_NAME) ?? null;
  if (token === null) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const result = await event.locals.sessionsService.validateSessionToken(token);

  if (result.isErr()) {
    event.locals.user = null;
    event.locals.session = null;
    event.locals.sessionsService.deleteSessionTokenCookie(event);
    return resolve(event);
  }

  const { session, user } = result.value;

  if (session !== null) {
    event.locals.sessionsService.setSessionTokenCookie(event, token, session.expiresAt);
  } else {
    event.locals.sessionsService.deleteSessionTokenCookie(event);
  }

  event.locals.session = session;
  event.locals.user = user;
  return resolve(event);
};

const securityHeadersHandle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  // Only set security headers if the headers are not immutable
  try {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
  } catch (error) {
    console.debug('Could not set security headers, they might be immutable', error);
  }

  return response;
};

const injectHeadScripts: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    transformPageChunk: ({ html }) => {
      return html.replace('%modewatcher.snippet%', generateSetInitialModeExpression({}));
    },
  });
};

// Apply database handle first, then auth handle
export const handle = sequence(securityHeadersHandle, injectHeadScripts, dbHandle, authHandle);
