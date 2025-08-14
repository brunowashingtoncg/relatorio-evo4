import { Ad } from '@/types/dashboard';
import { MetricCard } from './MetricCard';
import { MediaPreview } from './MediaPreview';
import { Button } from '@/components/ui/button';
import { Copy, MoreHorizontal, Trash2, Edit, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface AdItemProps {
  ad: Ad;
  campaignId: string;
  adSetId: string;
  onDuplicate: (campaignId: string, adSetId: string, adId: string) => void;
  onDelete: (campaignId: string, adSetId: string, adId: string) => void;
  onEdit: (campaignId: string, adSetId: string, adId: string, newName: string) => void;
  onEditMetric: (campaignId: string, adSetId: string, adId: string, metricId: string, newName: string, newValue: number, newType: 'sum' | 'average' | 'percentage') => void;
  onDeleteMetric: (campaignId: string, adSetId: string, adId: string, metricId: string) => void;
  onAddMetric: (campaignId: string, adSetId: string, adId: string, name: string, value: number, type: 'sum' | 'average' | 'percentage') => void;
}

export const AdItem = ({ ad, campaignId, adSetId, onDuplicate, onDelete, onEdit, onEditMetric, onDeleteMetric, onAddMetric }: AdItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(ad.name);
  const [editMetrics, setEditMetrics] = useState(ad.metrics);
  const [newMetric, setNewMetric] = useState({ name: '', value: 0, type: 'sum' as 'sum' | 'average' | 'percentage' });


  const handleMetricEdit = (metricId: string, name: string, value: number, type: 'sum' | 'average' | 'percentage') => {
    setEditMetrics(prev => prev.map(metric => 
      metric.id === metricId ? { ...metric, name, value, type } : metric
    ));
  };

  const handleMetricDelete = (metricId: string) => {
    setEditMetrics(prev => prev.filter(metric => metric.id !== metricId));
    onDeleteMetric(campaignId, adSetId, ad.id, metricId);
  };

  const handleAddMetric = () => {
    if (!newMetric.name.trim()) return;
    
    onAddMetric(campaignId, adSetId, ad.id, newMetric.name, newMetric.value, newMetric.type);
    setNewMetric({ name: '', value: 0, type: 'sum' });
  };


  const handleDialogSubmit = () => {
    if (!editName.trim()) return;
    
    // Aplicar mudanças do nome
    onEdit(campaignId, adSetId, ad.id, editName);
    
    // Aplicar mudanças das métricas
    editMetrics.forEach(metric => {
      const originalMetric = ad.metrics.find(m => m.id === metric.id);
      if (originalMetric && (
        originalMetric.name !== metric.name || 
        originalMetric.value !== metric.value || 
        originalMetric.type !== metric.type
      )) {
        onEditMetric(campaignId, adSetId, ad.id, metric.id, metric.name, metric.value, metric.type);
      }
    });
    
    setEditOpen(false);
  };
  return (
    <div className="bg-ad/50 border border-warning/20 rounded-lg p-3">
      <div className="flex gap-3">
        {/* Imagem maior */}
        {ad.mediaUrl && (
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted border border-border shadow-card flex-shrink-0">
            {ad.mediaType === 'video' ? (
              <video 
                src={ad.mediaUrl}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
            ) : (
              <img 
                src={ad.mediaUrl} 
                alt={ad.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">{ad.name}</h4>
              <p className="text-sm text-muted-foreground">Anúncio</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Anúncio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(campaignId, adSetId, ad.id)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(campaignId, adSetId, ad.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Métricas próximas à imagem */}
        {ad.metrics.length > 0 && (
          <div className="flex flex-col gap-1 min-w-[120px]">
            {ad.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} variant="ad" />
            ))}
          </div>
        )}
      </div>

        {/* Dialog de Edição */}
        <Dialog open={editOpen} onOpenChange={(open) => {
          setEditOpen(open);
          if (open) {
            setEditName(ad.name);
            setEditMetrics(ad.metrics);
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Anúncio</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label htmlFor="ad-edit-name">Nome do Anúncio</Label>
                <Input
                  id="ad-edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Digite o novo nome do anúncio"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Métricas</Label>
                </div>
                
                <div className="space-y-3">
                  {editMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={metric.name}
                          onChange={(e) => handleMetricEdit(metric.id, e.target.value, metric.value, metric.type)}
                          placeholder="Nome da métrica"
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={metric.value}
                            onChange={(e) => handleMetricEdit(metric.id, metric.name, Number(e.target.value), metric.type)}
                            placeholder="Valor"
                            className="flex-1"
                          />
                          <Select
                            value={metric.type}
                            onValueChange={(value: 'sum' | 'average' | 'percentage') => 
                              handleMetricEdit(metric.id, metric.name, metric.value, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sum">Soma</SelectItem>
                              <SelectItem value="average">Média</SelectItem>
                              <SelectItem value="percentage">%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMetricDelete(metric.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Adicionar Nova Métrica */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          value={newMetric.name}
                          onChange={(e) => setNewMetric(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nome da nova métrica"
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={newMetric.value}
                            onChange={(e) => setNewMetric(prev => ({ ...prev, value: Number(e.target.value) }))}
                            placeholder="Valor"
                            className="flex-1"
                          />
                          <Select
                            value={newMetric.type}
                            onValueChange={(value: 'sum' | 'average' | 'percentage') => 
                              setNewMetric(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sum">Soma</SelectItem>
                              <SelectItem value="average">Média</SelectItem>
                              <SelectItem value="percentage">%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddMetric}
                        disabled={!newMetric.name.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleDialogSubmit} 
                  disabled={!editName.trim()}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
};