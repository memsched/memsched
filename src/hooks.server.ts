import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { building } from '$app/environment';
import { getCache } from '$lib/server/cache';
import { type DBType, getDB } from '$lib/server/db';
import {
  MetricDataService,
  MetricsService,
  ObjectiveLogsService,
  ObjectivesService,
  PaymentService,
  SESSION_COOKIE_NAME,
  SessionsService,
  UsersService,
  WidgetsService,
} from '$lib/server/services';

const PRERENDERED_ROUTES = ['/docs', '/privacy', '/tos'];

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
  const metricsService = new MetricsService(db);
  const metricDataService = new MetricDataService(db, objectivesService, objectiveLogsService);
  const widgetsService = new WidgetsService(db, objectivesService, metricDataService);
  const sessionsService = new SessionsService(db);
  const paymentService = new PaymentService(db);

  return {
    usersService,
    objectivesService,
    objectiveLogsService,
    widgetsService,
    metricsService,
    metricDataService,
    sessionsService,
    paymentService,
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

// Apply database handle first, then auth handle
export const handle = sequence(dbHandle, authHandle);
