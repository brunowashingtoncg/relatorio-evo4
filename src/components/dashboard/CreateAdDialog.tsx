import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, X } from 'lucide-react';
import { CustomMetric } from '@/types/dashboard';

interface CreateAdDialogProps {
  onCreateAd: (name: string, metrics: CustomMetric[], mediaUrl?: string, mediaType?: 'image' | 'video') => void;
}

export const CreateAdDialog = ({ onCreateAd }: CreateAdDialogProps) => {
  const [open, setOpen] = useState(false);
  const [adName, setAdName] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [metrics, setMetrics] = useState<Array<{name: string, value: string, type: 'sum' | 'average' | 'percentage'}>>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaUrl(URL.createObjectURL(file));
    }
  };

  const addMetric = () => {
    setMetrics([...metrics, { name: '', value: '', type: 'sum' }]);
  };

  const updateMetric = (index: number, field: string, value: string) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    setMetrics(updatedMetrics);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!adName.trim()) return;

    const customMetrics: CustomMetric[] = metrics
      .filter(m => m.name.trim() && m.value.trim())
      .map((m, index) => ({
        id: `metric-${Date.now()}-${index}`,
        name: m.name,
        value: parseFloat(m.value) || 0,
        type: m.type
      }));

    const mediaType = mediaFile?.type.startsWith('video/') ? 'video' : 'image';
    
    onCreateAd(adName, customMetrics, mediaUrl || undefined, mediaUrl ? mediaType : undefined);
    
    // Reset form
    setAdName('');
    setMediaFile(null);
    setMediaUrl('');
    setMetrics([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Novo Anúncio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Anúncio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="ad-name">Nome do Anúncio</Label>
            <Input
              id="ad-name"
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              placeholder="Digite o nome do anúncio"
            />
          </div>

          <div>
            <Label>Upload de Mídia</Label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-accent transition-smooth">
                <Upload className="w-4 h-4" />
                Escolher arquivo
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {mediaFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{mediaFile.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setMediaFile(null);
                      setMediaUrl('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            {mediaUrl && (
              <div className="mt-2">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                  {mediaFile?.type.startsWith('video/') ? (
                    <video src={mediaUrl} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Métricas Personalizadas</Label>
              <Button variant="outline" size="sm" onClick={addMetric}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Métrica
              </Button>
            </div>
            
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <Input
                    placeholder="Nome da métrica"
                    value={metric.name}
                    onChange={(e) => updateMetric(index, 'name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Valor"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, 'value', e.target.value)}
                  />
                  <Select value={metric.type} onValueChange={(value: 'sum' | 'average' | 'percentage') => updateMetric(index, 'type', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sum">Soma</SelectItem>
                      <SelectItem value="average">Média</SelectItem>
                      <SelectItem value="percentage">Porcentagem</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => removeMetric(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!adName.trim()}>
              Criar Anúncio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};