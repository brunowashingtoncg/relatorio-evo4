import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Palette, RotateCcw } from 'lucide-react';

interface ThemeCustomizerProps {
  onThemeChange: (theme: CustomTheme) => void;
  currentTheme: CustomTheme;
}

export interface CustomTheme {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: string;
}

const defaultTheme: CustomTheme = {
  primary: '0 0% 9%',
  secondary: '0 0% 90%',
  background: '0 0% 98%',
  foreground: '0 0% 9%',
  accent: '0 0% 85%',
};

export const ThemeCustomizer = ({ onThemeChange, currentTheme }: ThemeCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempTheme, setTempTheme] = useState<CustomTheme>(currentTheme);

  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map(val => parseFloat(val.replace('%', '')));
    const hue = h / 360;
    const saturation = s / 100;
    const lightness = l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (saturation === 0) {
      r = g = b = lightness;
    } else {
      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;
      r = hue2rgb(p, q, hue + 1/3);
      g = hue2rgb(p, q, hue);
      b = hue2rgb(p, q, hue - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const handleColorChange = (property: keyof CustomTheme, hex: string) => {
    const hsl = hexToHsl(hex);
    setTempTheme(prev => ({
      ...prev,
      [property]: hsl
    }));
  };

  const applyTheme = () => {
    onThemeChange(tempTheme);
    setIsOpen(false);
  };

  const resetTheme = () => {
    setTempTheme(defaultTheme);
    onThemeChange(defaultTheme);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Customizar Tema
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizar Tema</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Cor Primária</Label>
              <div className="flex items-center gap-2">
                <input
                  id="primary-color"
                  type="color"
                  value={hslToHex(tempTheme.primary)}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={hslToHex(tempTheme.primary)}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Cor Secundária</Label>
              <div className="flex items-center gap-2">
                <input
                  id="secondary-color"
                  type="color"
                  value={hslToHex(tempTheme.secondary)}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={hslToHex(tempTheme.secondary)}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background-color">Cor de Fundo</Label>
              <div className="flex items-center gap-2">
                <input
                  id="background-color"
                  type="color"
                  value={hslToHex(tempTheme.background)}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={hslToHex(tempTheme.background)}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Cor de Destaque</Label>
              <div className="flex items-center gap-2">
                <input
                  id="accent-color"
                  type="color"
                  value={hslToHex(tempTheme.accent)}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={hslToHex(tempTheme.accent)}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={resetTheme}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={applyTheme}>
                Aplicar Tema
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};