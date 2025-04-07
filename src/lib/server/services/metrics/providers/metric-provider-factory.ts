import type { DBType } from '../../../db';
import type { WidgetMetric } from '../../../db/schema';
import type { BaseMetricProvider } from './base-metric-provider';
import { GithubMetricProvider } from './github-metric-provider';
import { ObjectiveMetricProvider } from './objective-metric-provider';
import type { ObjectivesService } from '../../objectives-service';
import type { ObjectiveLogsService } from '../../objective-logs-service';

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
