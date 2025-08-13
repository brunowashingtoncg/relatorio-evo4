import { useDashboard } from '@/hooks/useDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { CampaignItem } from '@/components/dashboard/CampaignItem';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { FolderOpen } from 'lucide-react';

const Index = () => {
  const { 
    dashboardData, 
    addCampaign, 
    addAdSet, 
    addAd, 
    duplicateItem, 
    toggleExpanded, 
    deleteItem,
    editCampaign,
    editAdSet,
    editAd,
    editAdMetric,
    deleteAdMetric,
    addAdMetric,
    toggleMetricSelection,
    selectAllMetrics,
    clearAllMetrics
  } = useDashboard();
  const { toast } = useToast();
  const { 
    theme, 
    setTheme, 
    dashboardTitle, 
    setDashboardTitle, 
    dashboardDescription, 
    setDashboardDescription,
    companyLogo,
    setCompanyLogo 
  } = useTheme();

  const handleExportPDF = () => {
    // Simulação da funcionalidade de exportação PDF
    toast({
      title: "PDF Exportado!",
      description: "O relatório foi exportado com sucesso.",
    });
    
    // Em uma implementação real, você usaria uma biblioteca como jsPDF ou html2canvas
    window.print();
  };

  const handleDuplicate = (type: 'campaign' | 'adset' | 'ad', campaignId?: string, adSetId?: string, itemId?: string) => {
    duplicateItem(type, campaignId, adSetId, itemId);
    toast({
      title: "Item duplicado!",
      description: `${type === 'campaign' ? 'Campanha' : type === 'adset' ? 'Conjunto' : 'Anúncio'} duplicado com sucesso.`,
    });
  };

  const handleDelete = (type: 'campaign' | 'adset' | 'ad', campaignId?: string, adSetId?: string, itemId?: string) => {
    deleteItem(type, campaignId, adSetId, itemId);
    toast({
      title: "Item excluído!",
      description: `${type === 'campaign' ? 'Campanha' : type === 'adset' ? 'Conjunto' : 'Anúncio'} excluído com sucesso.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          onCreateCampaign={addCampaign}
          onExportPDF={handleExportPDF}
          title={dashboardTitle}
          description={dashboardDescription}
          onTitleChange={setDashboardTitle}
          onDescriptionChange={setDashboardDescription}
          onThemeChange={setTheme}
          currentTheme={theme}
          companyLogo={companyLogo}
          onLogoChange={setCompanyLogo}
        />
        
        <DashboardOverview 
          metrics={dashboardData.overviewMetrics} 
          selectedMetricIds={dashboardData.selectedMetricIds}
          onToggleMetric={toggleMetricSelection}
          onSelectAll={selectAllMetrics}
          onClearAll={clearAllMetrics}
          totalDailyBudget={dashboardData.totalDailyBudget}
        />
        
        <div className="space-y-6">
          {dashboardData.campaigns.length === 0 ? (
            <div className="bg-card shadow-card rounded-xl p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Nenhuma campanha criada
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Comece criando sua primeira campanha para organizar seus conjuntos de anúncios e anúncios.
              </p>
            </div>
          ) : (
            dashboardData.campaigns.map((campaign) => (
              <CampaignItem
                key={campaign.id}
                campaign={campaign}
                onCreateAdSet={addAdSet}
                onCreateAd={addAd}
                onToggleExpanded={toggleExpanded}
                onDuplicateCampaign={(id) => handleDuplicate('campaign', undefined, undefined, id)}
                onDuplicateAdSet={(campaignId, adSetId) => handleDuplicate('adset', campaignId, undefined, adSetId)}
                onDuplicateAd={(campaignId, adSetId, adId) => handleDuplicate('ad', campaignId, adSetId, adId)}
                onDeleteCampaign={(id) => handleDelete('campaign', undefined, undefined, id)}
                onDeleteAdSet={(campaignId, adSetId) => handleDelete('adset', campaignId, undefined, adSetId)}
                onDeleteAd={(campaignId, adSetId, adId) => handleDelete('ad', campaignId, adSetId, adId)}
                onEditCampaign={editCampaign}
                onEditAdSet={editAdSet}
                onEditAd={editAd}
                onEditAdMetric={editAdMetric}
                onDeleteAdMetric={deleteAdMetric}
                onAddAdMetric={addAdMetric}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;