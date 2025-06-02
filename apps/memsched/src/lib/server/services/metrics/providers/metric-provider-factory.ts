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
import type { DBType } from '../../../db';
import type { WidgetMetric } from '../../../db/schema';
import type { ObjectiveLogsService } from '../../objective-logs-service';
import type { ObjectivesService } from '../../objectives-service';
import type { BaseMetricProvider } from './base-metric-provider';
import { GithubMetricProvider } from './github-metric-provider';
import { ObjectiveMetricProvider } from './objective-metric-provider';

export class MetricProviderFactory {
  private objectiveProvider: ObjectiveMetricProvider;
  private githubProvider: GithubMetricProvider;

  constructor(
    db: DBType,
    objectivesService: ObjectivesService,
    objectiveLogsService: ObjectiveLogsService
  ) {
    this.objectiveProvider = new ObjectiveMetricProvider(objectivesService, objectiveLogsService);
    this.githubProvider = new GithubMetricProvider(db);
  }

  public getProvider(provider: WidgetMetric['provider']): BaseMetricProvider {
    switch (provider) {
      case 'objective':
        return this.objectiveProvider;
      case 'github':
        return this.githubProvider;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
