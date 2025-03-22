import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getDB, type DBType } from '$lib/server/db';
import { getCache } from '$lib/server/cache';
import {
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
  SESSION_COOKIE_NAME,
} from '$lib/server/session';
import {
  UsersService,
  ObjectivesService,
  ObjectiveLogsService,
  WidgetsService,
  MetricsService,
} from '$lib/server/services';

/**
 * Initializes all services using dependency injection
 * This pattern avoids circular dependencies by creating all service instances
 * with their dependencies
 */
function initializeServices(db: DBType) {
  // Create independent services first
  const usersService = new UsersService(db);
  const metricsService = new MetricsService(db);

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
  };
}

// This will handle database injection
const dbHandle: Handle = async ({ event, resolve }) => {
  // Make database available via event.platform
  event.locals.db = getDB(event.platform) as DBType;
  event.locals.cache = getCache(event.platform);
  const services = initializeServices(event.locals.db);
  Object.assign(event.locals, services);

  return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE_NAME) ?? null;
  if (token === null) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await validateSessionToken(event.locals.db, token);
  if (session !== null) {
    setSessionTokenCookie(event, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event);
  }

  event.locals.session = session;
  event.locals.user = user;
  return resolve(event);
};

// Apply database handle first, then auth handle
export const handle = sequence(dbHandle, authHandle);
