import { CustomMetric } from '@/types/dashboard';
import { MetricCard } from './MetricCard';
import { MetricSelector } from './MetricSelector';
import { formatCurrency } from '@/lib/currency';
import { BarChart3, TrendingUp } from 'lucide-react';

interface DashboardOverviewProps {
  metrics: CustomMetric[];
  selectedMetricIds: string[];
  onToggleMetric: (metricId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  totalDailyBudget?: number;
}

export const DashboardOverview = ({ 
  metrics, 
  selectedMetricIds, 
  onToggleMetric, 
  onSelectAll, 
  onClearAll,
  totalDailyBudget 
}: DashboardOverviewProps) => {
  if (metrics.length === 0) {
    return (
      <div className="bg-card shadow-card rounded-xl p-8 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma métrica disponível</h3>
          <p className="text-muted-foreground">Crie campanhas e anúncios com métricas para ver os dados aqui.</p>
        </div>
      </div>
    );
  }

  const selectedMetrics = metrics.filter(metric => selectedMetricIds.includes(metric.id));
  
  return (
    <div className="bg-card shadow-card rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Visão Geral</h2>
        <MetricSelector
          allMetrics={metrics}
          selectedMetricIds={selectedMetricIds}
          onToggleMetric={onToggleMetric}
          onSelectAll={onSelectAll}
          onClearAll={onClearAll}
        />
      </div>
      
      {selectedMetrics.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma métrica selecionada</h3>
          <p className="text-muted-foreground">Selecione métricas para exibir na visão geral.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {totalDailyBudget !== undefined && totalDailyBudget > 0 && (
            <div className="bg-card border-2 border-primary/20 shadow-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Investimento Diário Total
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(totalDailyBudget)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    por dia
                  </p>
                </div>
                <div className="text-primary">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </div>
          )}
          {selectedMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} variant="overview" />
          ))}
        </div>
      )}
    </div>
  );
};