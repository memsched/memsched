import type { DBType } from '../../../db';
import type { WidgetMetric } from '../../../db/schema';
import type { BaseMetricProvider } from './base-metric-provider';
import { GithubMetricProvider } from './github-metric-provider';
import { ObjectiveMetricProvider } from './objective-metric-provider';

export class MetricProviderFactory {
  private objectiveProvider: ObjectiveMetricProvider;
  private githubProvider: GithubMetricProvider;

  constructor(db: DBType) {
    this.objectiveProvider = new ObjectiveMetricProvider(db);
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
