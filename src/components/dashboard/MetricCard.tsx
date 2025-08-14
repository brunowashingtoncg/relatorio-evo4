import { CustomMetric } from '@/types/dashboard';

interface MetricCardProps {
  metric: CustomMetric;
  variant?: 'campaign' | 'adset' | 'ad' | 'overview';
}

export const MetricCard = ({ metric, variant = 'overview' }: MetricCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'campaign':
        return 'bg-campaign border-primary/20';
      case 'adset':
        return 'bg-adset border-success/20';
      case 'ad':
        return 'bg-ad border-warning/20';
      default:
        return 'bg-card border-border';
    }
  };

  const formatValue = (value: number, type: string) => {
    if (type === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  return (
    <div className={`p-2 rounded-md border shadow-sm transition-smooth ${getVariantStyles()}`}>
      <div className="text-xs font-medium text-muted-foreground mb-0.5 truncate">
        {metric.name}
      </div>
      <div className="text-sm font-bold text-foreground">
        {formatValue(metric.value, metric.type)}
      </div>
    </div>
  );
};