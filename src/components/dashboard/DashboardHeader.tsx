import { Button } from '@/components/ui/button';
import { Download, Upload, Building2 } from 'lucide-react';
import { useRef } from 'react';
import { EditableText } from './EditableText';
import { ThemeCustomizer, CustomTheme } from './ThemeCustomizer';
import { CreateCampaignDialog } from './CreateCampaignDialog';

interface DashboardHeaderProps {
  onCreateCampaign: (name: string, budgetType: 'CBO' | 'ABO', dailyBudget?: number) => void;
  onExportPDF: () => void;
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onThemeChange: (theme: CustomTheme) => void;
  currentTheme: CustomTheme;
  companyLogo?: string;
  onLogoChange: (logo: string) => void;
}

export const DashboardHeader = ({ 
  onCreateCampaign, 
  onExportPDF, 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange,
  onThemeChange,
  currentTheme,
  companyLogo,
  onLogoChange 
}: DashboardHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onLogoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gradient-card shadow-elevated rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="relative w-12 h-12 bg-primary rounded-xl cursor-pointer hover:bg-primary/80 transition-colors flex items-center justify-center group"
            onClick={handleLogoClick}
            title="Clique para fazer upload da logo da empresa"
          >
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Logo da empresa" 
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground mb-1" />
                <Upload className="w-3 h-3 text-primary-foreground group-hover:scale-110 transition-transform" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1 max-w-lg">
            <EditableText
              value={title}
              onSave={onTitleChange}
              className="text-2xl font-bold text-foreground"
              placeholder="Título do Dashboard"
            />
            <EditableText
              value={description}
              onSave={onDescriptionChange}
              className="text-muted-foreground mt-1"
              placeholder="Descrição do dashboard"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeCustomizer 
            onThemeChange={onThemeChange}
            currentTheme={currentTheme}
          />
          
          <CreateCampaignDialog onCreateCampaign={onCreateCampaign} />
          
          <Button variant="outline" size="lg" onClick={onExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};