import { CustomMetric } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings2, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MetricSelectorProps {
  allMetrics: CustomMetric[];
  selectedMetricIds: string[];
  onToggleMetric: (metricId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const MetricSelector = ({ 
  allMetrics, 
  selectedMetricIds, 
  onToggleMetric, 
  onSelectAll, 
  onClearAll 
}: MetricSelectorProps) => {
  const selectedCount = selectedMetricIds.length;
  const totalCount = allMetrics.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 bg-card border-border hover:bg-accent"
        >
          <Settings2 className="w-4 h-4" />
          Selecionar Métricas
          <Badge variant="secondary" className="ml-1">
            {selectedCount}/{totalCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-card border-border shadow-elevated" 
        align="end"
        sideOffset={8}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Métricas da Visão Geral</h4>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSelectAll}
                className="h-7 px-2 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Todas
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-7 px-2 text-xs"
              >
                <EyeOff className="w-3 h-3 mr-1" />
                Nenhuma
              </Button>
            </div>
          </div>
          
          {allMetrics.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma métrica disponível
            </p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {allMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetricIds.includes(metric.id)}
                    onCheckedChange={() => onToggleMetric(metric.id)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={metric.id}
                    className="flex-1 text-sm font-medium text-foreground cursor-pointer"
                  >
                    {metric.name}
                  </label>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-border"
                  >
                    {metric.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};