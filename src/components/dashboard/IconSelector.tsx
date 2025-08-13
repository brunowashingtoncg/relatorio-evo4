import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  ShoppingCart, 
  Heart, 
  Star, 
  Zap, 
  Trophy, 
  Gift, 
  Crown,
  TrendingUp,
  Building2,
  Coffee,
  Camera,
  Music,
  Gamepad2,
  Car,
  Plane,
  MapPin,
  Users,
  DollarSign,
  Shield,
  Rocket,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useState } from 'react';

const predefinedIcons = [
  { name: 'Target', icon: Target, color: '#3B82F6' },
  { name: 'Shopping', icon: ShoppingCart, color: '#10B981' },
  { name: 'Heart', icon: Heart, color: '#EF4444' },
  { name: 'Star', icon: Star, color: '#F59E0B' },
  { name: 'Zap', icon: Zap, color: '#8B5CF6' },
  { name: 'Trophy', icon: Trophy, color: '#F59E0B' },
  { name: 'Gift', icon: Gift, color: '#EF4444' },
  { name: 'Crown', icon: Crown, color: '#F59E0B' },
  { name: 'Trending', icon: TrendingUp, color: '#10B981' },
  { name: 'Building', icon: Building2, color: '#6B7280' },
  { name: 'Coffee', icon: Coffee, color: '#92400E' },
  { name: 'Camera', icon: Camera, color: '#374151' },
  { name: 'Music', icon: Music, color: '#7C3AED' },
  { name: 'Games', icon: Gamepad2, color: '#DC2626' },
  { name: 'Car', icon: Car, color: '#059669' },
  { name: 'Plane', icon: Plane, color: '#2563EB' },
  { name: 'Location', icon: MapPin, color: '#DC2626' },
  { name: 'Users', icon: Users, color: '#7C2D12' },
  { name: 'Money', icon: DollarSign, color: '#15803D' },
  { name: 'Shield', icon: Shield, color: '#1D4ED8' },
  { name: 'Rocket', icon: Rocket, color: '#C2410C' },
  { name: 'Sparkles', icon: Sparkles, color: '#A855F7' },
  { name: 'Sun', icon: Sun, color: '#EA580C' },
  { name: 'Moon', icon: Moon, color: '#4338CA' }
];

interface IconSelectorProps {
  selectedIcon?: { name: string; icon: any; color: string };
  onSelectIcon: (icon: { name: string; icon: any; color: string }) => void;
  trigger: React.ReactNode;
}

export const IconSelector = ({ selectedIcon, onSelectIcon, trigger }: IconSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (icon: { name: string; icon: any; color: string }) => {
    onSelectIcon(icon);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecionar Ícone</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-6 gap-3 p-4">
          {predefinedIcons.map((iconData) => {
            const IconComponent = iconData.icon;
            const isSelected = selectedIcon?.name === iconData.name;
            
            return (
              <Button
                key={iconData.name}
                variant="ghost"
                size="sm"
                className={`h-12 w-12 p-0 rounded-lg transition-all hover:scale-105 ${
                  isSelected 
                    ? 'ring-2 ring-primary bg-primary/10' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleSelect(iconData)}
                title={iconData.name}
              >
                <IconComponent 
                  className="w-5 h-5" 
                  style={{ color: iconData.color }}
                />
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};