import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { getDB, type DBType } from '$lib/server/db';
import { getCache } from '$lib/server/cache';
import {
  UsersService,
  ObjectivesService,
  ObjectiveLogsService,
  WidgetsService,
  MetricsService,
  SessionsService,
  PaymentService,
  GithubMetricsService,
  SESSION_COOKIE_NAME,
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
  const githubMetricsService = new GithubMetricsService(db);
  const metricsService = new MetricsService(db, githubMetricsService);
  const sessionsService = new SessionsService(db);
  const paymentService = new PaymentService(db);

  // Create interdependent services with temporary null for circular dependencies
  const widgetsService = new WidgetsService(db, null, metricsService);

  // Now create services that depend on the ones above
  const objectivesService = new ObjectivesService(db, widgetsService, metricsService);

  // Resolve circular dependencies
  widgetsService.setObjectivesService(objectivesService);

  // Create services that depend on objectivesService
  const objectiveLogsService = new ObjectiveLogsService(db, objectivesService);

  return {
    usersService,
    objectivesService,
    objectiveLogsService,
    widgetsService,
    metricsService,
    githubMetricsService,
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
