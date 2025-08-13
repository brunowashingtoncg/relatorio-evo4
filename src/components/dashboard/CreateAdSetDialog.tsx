import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface CreateAdSetDialogProps {
  campaignId: string;
  campaignBudgetType: 'CBO' | 'ABO';
  onCreateAdSet: (campaignId: string, name: string, dailyBudget?: number) => void;
  trigger?: React.ReactNode;
}

export const CreateAdSetDialog = ({ 
  campaignId, 
  campaignBudgetType,
  onCreateAdSet, 
  trigger 
}: CreateAdSetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dailyBudget, setDailyBudget] = useState<string>("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    const budgetValue = campaignBudgetType === 'ABO' && dailyBudget ? parseFloat(dailyBudget) : undefined;
    onCreateAdSet(campaignId, name.trim(), budgetValue);
    
    // Reset form
    setName("");
    setDailyBudget("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Plus className="w-3 h-3 mr-1" />
            Conjunto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Conjunto de Anúncios</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="adset-name">Nome do Conjunto</Label>
            <Input
              id="adset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do conjunto"
              className="mt-1"
            />
          </div>

          {campaignBudgetType === 'ABO' && (
            <div>
              <Label htmlFor="adset-daily-budget">Investimento Diário (R$)</Label>
              <Input
                id="adset-daily-budget"
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Esta campanha usa ABO, defina o orçamento para este conjunto
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim() || (campaignBudgetType === 'ABO' && !dailyBudget)}>
              Criar Conjunto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};