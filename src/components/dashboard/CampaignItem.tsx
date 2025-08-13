import { Campaign, CustomMetric } from '@/types/dashboard';
import { MetricCard } from './MetricCard';
import { AdSetItem } from './AdSetItem';
import { IconSelector } from './IconSelector';
import { CreateAdSetDialog } from './CreateAdSetDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronRight, Copy, MoreHorizontal, Trash2, Target, Edit, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';

interface CampaignItemProps {
  campaign: Campaign;
  onCreateAdSet: (campaignId: string, name: string, dailyBudget?: number) => void;
  onCreateAd: (campaignId: string, adSetId: string, name: string, metrics: CustomMetric[], mediaUrl?: string, mediaType?: 'image' | 'video') => void;
  onToggleExpanded: (type: 'campaign' | 'adset', campaignId: string, adSetId?: string) => void;
  onDuplicateCampaign: (campaignId: string) => void;
  onDuplicateAdSet: (campaignId: string, adSetId: string) => void;
  onDuplicateAd: (campaignId: string, adSetId: string, adId: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onDeleteAdSet: (campaignId: string, adSetId: string) => void;
  onDeleteAd: (campaignId: string, adSetId: string, adId: string) => void;
  onEditCampaign: (campaignId: string, newName: string, iconData?: { name: string; icon: any; color: string }) => void;
  onEditAdSet: (campaignId: string, adSetId: string, newName: string) => void;
  onEditAd: (campaignId: string, adSetId: string, adId: string, newName: string) => void;
  onEditAdMetric: (campaignId: string, adSetId: string, adId: string, metricId: string, newName: string, newValue: number, newType: 'sum' | 'average' | 'percentage') => void;
  onDeleteAdMetric: (campaignId: string, adSetId: string, adId: string, metricId: string) => void;
  onAddAdMetric: (campaignId: string, adSetId: string, adId: string, name: string, value: number, type: 'sum' | 'average' | 'percentage') => void;
}

export const CampaignItem = ({ 
  campaign, 
  onCreateAdSet, 
  onCreateAd, 
  onToggleExpanded,
  onDuplicateCampaign,
  onDuplicateAdSet,
  onDuplicateAd,
  onDeleteCampaign,
  onDeleteAdSet,
  onDeleteAd,
  onEditCampaign,
  onEditAdSet,
  onEditAd,
  onEditAdMetric,
  onDeleteAdMetric,
  onAddAdMetric
}: CampaignItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(campaign.name);
  const [selectedIcon, setSelectedIcon] = useState(campaign.iconData || { name: 'Target', icon: Target, color: '#3B82F6' });

  const handleEditSubmit = () => {
    if (!editName.trim()) return;
    
    onEditCampaign(campaign.id, editName, selectedIcon);
    setEditOpen(false);
  };

  const handleIconSelect = (iconData: { name: string; icon: any; color: string }) => {
    setSelectedIcon(iconData);
  };

  const totalAds = campaign.adSets.reduce((total, adSet) => total + adSet.ads.length, 0);

  return (
    <div className="bg-campaign/50 border border-primary/20 rounded-xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpanded('campaign', campaign.id)}
          >
            {campaign.isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
          <IconSelector
            selectedIcon={campaign.iconData || { name: 'Target', icon: Target, color: '#3B82F6' }}
            onSelectIcon={(iconData) => onEditCampaign(campaign.id, campaign.name, iconData)}
            trigger={
              <div 
                className="relative w-8 h-8 rounded-lg cursor-pointer hover:scale-105 transition-all flex items-center justify-center"
                style={{ backgroundColor: campaign.iconData?.color || '#3B82F6' }}
                title="Clique para trocar o ícone da campanha"
              >
                {campaign.iconData ? (
                  <campaign.iconData.icon className="w-4 h-4 text-white" />
                ) : (
                  <Target className="w-4 h-4 text-white" />
                )}
              </div>
            }
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-foreground">{campaign.name}</h2>
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {campaign.budgetType}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{campaign.adSets.length} conjunto(s) • {totalAds} anúncio(s)</span>
              {campaign.dailyBudget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{formatCurrency(campaign.dailyBudget)}/dia</span>
                </div>
              )}
              {campaign.budgetType === 'ABO' && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>
                    {formatCurrency(campaign.adSets.reduce((total, adSet) => total + (adSet.dailyBudget || 0), 0))}/dia
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CreateAdSetDialog 
            campaignId={campaign.id}
            campaignBudgetType={campaign.budgetType}
            onCreateAdSet={onCreateAdSet}
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
                Editar Campanha
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicateCampaign(campaign.id)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicar Campanha
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteCampaign(campaign.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Campanha
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog de Edição */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Campanha</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign-edit-name">Nome da Campanha</Label>
                  <Input
                    id="campaign-edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Digite o novo nome da campanha"
                  />
                </div>
                <div>
                  <Label>Ícone da Campanha</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <IconSelector
                      selectedIcon={selectedIcon}
                      onSelectIcon={handleIconSelect}
                      trigger={
                        <div 
                          className="w-12 h-12 rounded-lg cursor-pointer hover:scale-105 transition-all flex items-center justify-center"
                          style={{ backgroundColor: selectedIcon.color }}
                        >
                          <selectedIcon.icon className="w-6 h-6 text-white" />
                        </div>
                      }
                    />
                    <div className="text-sm text-muted-foreground">
                      Clique no ícone para selecionar um novo ícone
                    </div>
                  </div>
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

      {campaign.metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {campaign.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} variant="campaign" />
          ))}
        </div>
      )}

      {campaign.isExpanded && (
        <div className="space-y-4">
          {campaign.adSets.map((adSet) => (
            <AdSetItem
              key={adSet.id}
              adSet={adSet}
              campaignId={campaign.id}
              campaignBudgetType={campaign.budgetType}
              onCreateAd={onCreateAd}
              onToggleExpanded={(campaignId, adSetId) => onToggleExpanded('adset', campaignId, adSetId)}
              onDuplicateAdSet={onDuplicateAdSet}
              onDuplicateAd={onDuplicateAd}
              onDeleteAdSet={onDeleteAdSet}
              onDeleteAd={onDeleteAd}
              onEditAdSet={onEditAdSet}
              onEditAd={onEditAd}
              onEditAdMetric={onEditAdMetric}
              onDeleteAdMetric={onDeleteAdMetric}
              onAddAdMetric={onAddAdMetric}
            />
          ))}
        </div>
      )}
    </div>
  );
};