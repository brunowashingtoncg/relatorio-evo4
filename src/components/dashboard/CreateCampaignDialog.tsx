import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";

interface CreateCampaignDialogProps {
  onCreateCampaign: (name: string, budgetType: 'CBO' | 'ABO', dailyBudget?: number) => void;
}

export const CreateCampaignDialog = ({ onCreateCampaign }: CreateCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [budgetType, setBudgetType] = useState<'CBO' | 'ABO'>('CBO');
  const [dailyBudget, setDailyBudget] = useState<string>("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    const budgetValue = budgetType === 'CBO' && dailyBudget ? parseFloat(dailyBudget) : undefined;
    onCreateCampaign(name.trim(), budgetType, budgetValue);
    
    // Reset form
    setName("");
    setBudgetType('CBO');
    setDailyBudget("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Campanha</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="campaign-name">Nome da Campanha</Label>
            <Input
              id="campaign-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da campanha"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Tipo de Orçamento</Label>
            <RadioGroup value={budgetType} onValueChange={(value: 'CBO' | 'ABO') => setBudgetType(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CBO" id="cbo" />
                <Label htmlFor="cbo" className="text-sm">
                  CBO - Campaign Budget Optimization
                  <p className="text-xs text-muted-foreground">Orçamento definido a nível de campanha</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ABO" id="abo" />
                <Label htmlFor="abo" className="text-sm">
                  ABO - Ad Set Budget Optimization
                  <p className="text-xs text-muted-foreground">Orçamento definido a nível de conjunto</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {budgetType === 'CBO' && (
            <div>
              <Label htmlFor="daily-budget">Investimento Diário (R$)</Label>
              <Input
                id="daily-budget"
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="mt-1"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              Criar Campanha
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};