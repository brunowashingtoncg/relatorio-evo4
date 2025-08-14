import { AdSet } from '@/types/dashboard';
import { MetricCard } from './MetricCard';
import { AdItem } from './AdItem';
import { CreateAdDialog } from './CreateAdDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronRight, Copy, MoreHorizontal, Trash2, Edit, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CustomMetric } from '@/types/dashboard';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';

interface AdSetItemProps {
  adSet: AdSet;
  campaignId: string;
  campaignBudgetType?: 'CBO' | 'ABO';
  onCreateAd: (campaignId: string, adSetId: string, name: string, metrics: CustomMetric[], mediaUrl?: string, mediaType?: 'image' | 'video') => void;
  onToggleExpanded: (campaignId: string, adSetId: string) => void;
  onDuplicateAdSet: (campaignId: string, adSetId: string) => void;
  onDuplicateAd: (campaignId: string, adSetId: string, adId: string) => void;
  onDeleteAdSet: (campaignId: string, adSetId: string) => void;
  onDeleteAd: (campaignId: string, adSetId: string, adId: string) => void;
  onEditAdSet: (campaignId: string, adSetId: string, newName: string) => void;
  onEditAd: (campaignId: string, adSetId: string, adId: string, newName: string) => void;
  onEditAdMetric: (campaignId: string, adSetId: string, adId: string, metricId: string, newName: string, newValue: number, newType: 'sum' | 'average' | 'percentage') => void;
  onDeleteAdMetric: (campaignId: string, adSetId: string, adId: string, metricId: string) => void;
  onAddAdMetric: (campaignId: string, adSetId: string, adId: string, name: string, value: number, type: 'sum' | 'average' | 'percentage') => void;
}

export const AdSetItem = ({ 
  adSet, 
  campaignId,
  campaignBudgetType, 
  onCreateAd, 
  onToggleExpanded, 
  onDuplicateAdSet,
  onDuplicateAd,
  onDeleteAdSet,
  onDeleteAd,
  onEditAdSet,
  onEditAd,
  onEditAdMetric,
  onDeleteAdMetric,
  onAddAdMetric
}: AdSetItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(adSet.name);

  const handleEditSubmit = () => {
    if (!editName.trim()) return;
    
    onEditAdSet(campaignId, adSet.id, editName);
    setEditName(adSet.name); // Reset para o valor atual
    setEditOpen(false);
  };
  return (
    <div className="bg-adset/50 border border-success/20 rounded-lg p-4 ml-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpanded(campaignId, adSet.id)}
          >
            {adSet.isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
          <div>
            <h3 className="font-semibold text-foreground">{adSet.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Conjunto de Anúncios • {adSet.ads.length} anúncio(s)</span>
              {campaignBudgetType === 'ABO' && adSet.dailyBudget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{formatCurrency(adSet.dailyBudget)}/dia</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CreateAdDialog 
            onCreateAd={(name, metrics, mediaUrl, mediaType) => 
              onCreateAd(campaignId, adSet.id, name, metrics, mediaUrl, mediaType)
            } 
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Conjunto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicateAdSet(campaignId, adSet.id)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicar Conjunto
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteAdSet(campaignId, adSet.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Conjunto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog de Edição */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Conjunto de Anúncios</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adset-edit-name">Nome do Conjunto</Label>
                  <Input
                    id="adset-edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Digite o novo nome do conjunto"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleEditSubmit} disabled={!editName.trim()}>
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {adSet.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mb-3">
          {adSet.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} variant="adset" />
          ))}
        </div>
      )}

      {adSet.isExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {adSet.ads.map((ad) => (
            <AdItem
              key={ad.id}
              ad={ad}
              campaignId={campaignId}
              adSetId={adSet.id}
              onDuplicate={onDuplicateAd}
              onDelete={onDeleteAd}
              onEdit={onEditAd}
              onEditMetric={onEditAdMetric}
              onDeleteMetric={onDeleteAdMetric}
              onAddMetric={onAddAdMetric}
            />
          ))}
        </div>
      )}
    </div>
  );
};