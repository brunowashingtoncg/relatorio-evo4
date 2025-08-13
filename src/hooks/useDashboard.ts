import { useState, useCallback } from 'react';
import { Campaign, AdSet, Ad, CustomMetric, DashboardData } from '@/types/dashboard';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    campaigns: [],
    overviewMetrics: [],
    selectedMetricIds: []
  });

  const calculateMetrics = useCallback((items: (Ad | AdSet | Campaign)[]): CustomMetric[] => {
    const metricMap = new Map<string, { values: number[], type: 'sum' | 'average' | 'percentage' }>();
    
    items.forEach(item => {
      item.metrics.forEach(metric => {
        if (!metricMap.has(metric.name)) {
          metricMap.set(metric.name, { values: [], type: metric.type });
        }
        metricMap.get(metric.name)!.values.push(metric.value);
      });
    });

    return Array.from(metricMap.entries()).map(([name, { values, type }]) => {
      let calculatedValue: number;
      
      switch (type) {
        case 'sum':
          calculatedValue = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'average':
          calculatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'percentage':
          calculatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
      }

      return {
        id: `${name}-${type}`,
        name,
        value: calculatedValue,
        type
      };
    });
  }, []);

  const updateMetrics = useCallback((campaigns: Campaign[]) => {
    const updatedCampaigns = campaigns.map(campaign => {
      const updatedAdSets = campaign.adSets.map(adSet => ({
        ...adSet,
        metrics: calculateMetrics(adSet.ads)
      }));
      
      return {
        ...campaign,
        adSets: updatedAdSets,
        metrics: calculateMetrics(updatedAdSets)
      };
    });

    const overviewMetrics = calculateMetrics(updatedCampaigns);
    
    // Calcular total de investimento diário
    const totalDailyBudget = updatedCampaigns.reduce((total, campaign) => {
      if (campaign.budgetType === 'CBO' && campaign.dailyBudget) {
        return total + campaign.dailyBudget;
      } else if (campaign.budgetType === 'ABO') {
        const adSetTotal = campaign.adSets.reduce((adSetSum, adSet) => {
          return adSetSum + (adSet.dailyBudget || 0);
        }, 0);
        return total + adSetTotal;
      }
      return total;
    }, 0);

    setDashboardData(prev => ({
      campaigns: updatedCampaigns,
      overviewMetrics,
      selectedMetricIds: prev.selectedMetricIds.length === 0 
        ? overviewMetrics.map(m => m.id) 
        : prev.selectedMetricIds.filter(id => overviewMetrics.some(m => m.id === id)),
      totalDailyBudget
    }));
  }, [calculateMetrics]);

  const addCampaign = useCallback((name: string, budgetType: 'CBO' | 'ABO' = 'CBO', dailyBudget?: number) => {
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name,
      adSets: [],
      metrics: [],
      isExpanded: true,
      budgetType,
      dailyBudget
    };

    const updatedCampaigns = [...dashboardData.campaigns, newCampaign];
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const addAdSet = useCallback((campaignId: string, name: string, dailyBudget?: number) => {
    const newAdSet: AdSet = {
      id: `adset-${Date.now()}`,
      name,
      ads: [],
      metrics: [],
      isExpanded: true,
      dailyBudget
    };

    const updatedCampaigns = dashboardData.campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, adSets: [...campaign.adSets, newAdSet] }
        : campaign
    );
    
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const addAd = useCallback((campaignId: string, adSetId: string, name: string, metrics: CustomMetric[], mediaUrl?: string, mediaType?: 'image' | 'video') => {
    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      name,
      metrics,
      mediaUrl,
      mediaType,
      isExpanded: true
    };

    const updatedCampaigns = dashboardData.campaigns.map(campaign => 
      campaign.id === campaignId 
        ? {
            ...campaign,
            adSets: campaign.adSets.map(adSet =>
              adSet.id === adSetId
                ? { ...adSet, ads: [...adSet.ads, newAd] }
                : adSet
            )
          }
        : campaign
    );
    
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const duplicateItem = useCallback((type: 'campaign' | 'adset' | 'ad', campaignId?: string, adSetId?: string, itemId?: string) => {
    let updatedCampaigns = [...dashboardData.campaigns];

    if (type === 'campaign' && itemId) {
      const campaignToDuplicate = updatedCampaigns.find(c => c.id === itemId);
      if (campaignToDuplicate) {
        const duplicated = {
          ...campaignToDuplicate,
          id: `campaign-${Date.now()}`,
          name: `${campaignToDuplicate.name} (Copy)`
        };
        updatedCampaigns.push(duplicated);
      }
    } else if (type === 'adset' && campaignId && itemId) {
      updatedCampaigns = updatedCampaigns.map(campaign => 
        campaign.id === campaignId 
          ? {
              ...campaign,
              adSets: campaign.adSets.map(adSet => 
                adSet.id === itemId 
                  ? { ...adSet, id: `adset-${Date.now()}`, name: `${adSet.name} (Copy)` }
                  : adSet
              ).concat(campaign.adSets.find(adSet => adSet.id === itemId) ? 
                [{ ...campaign.adSets.find(adSet => adSet.id === itemId)!, id: `adset-${Date.now()}`, name: `${campaign.adSets.find(adSet => adSet.id === itemId)!.name} (Copy)` }] : [])
            }
          : campaign
      );
    } else if (type === 'ad' && campaignId && adSetId && itemId) {
      updatedCampaigns = updatedCampaigns.map(campaign => 
        campaign.id === campaignId 
          ? {
              ...campaign,
              adSets: campaign.adSets.map(adSet =>
                adSet.id === adSetId
                  ? {
                      ...adSet,
                      ads: adSet.ads.concat(adSet.ads.find(ad => ad.id === itemId) ? 
                        [{ ...adSet.ads.find(ad => ad.id === itemId)!, id: `ad-${Date.now()}`, name: `${adSet.ads.find(ad => ad.id === itemId)!.name} (Copy)` }] : [])
                    }
                  : adSet
              )
            }
          : campaign
      );
    }
    
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const toggleExpanded = useCallback((type: 'campaign' | 'adset', campaignId: string, adSetId?: string) => {
    const updatedCampaigns = dashboardData.campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        if (type === 'campaign') {
          return { ...campaign, isExpanded: !campaign.isExpanded };
        } else if (type === 'adset' && adSetId) {
          return {
            ...campaign,
            adSets: campaign.adSets.map(adSet =>
              adSet.id === adSetId 
                ? { ...adSet, isExpanded: !adSet.isExpanded }
                : adSet
            )
          };
        }
      }
      return campaign;
    });

    setDashboardData(prev => ({ ...prev, campaigns: updatedCampaigns }));
  }, [dashboardData.campaigns]);

  const deleteItem = useCallback((type: 'campaign' | 'adset' | 'ad', campaignId?: string, adSetId?: string, itemId?: string) => {
    let updatedCampaigns = [...dashboardData.campaigns];

    if (type === 'campaign' && itemId) {
      updatedCampaigns = updatedCampaigns.filter(c => c.id !== itemId);
    } else if (type === 'adset' && campaignId && itemId) {
      updatedCampaigns = updatedCampaigns.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, adSets: campaign.adSets.filter(adSet => adSet.id !== itemId) }
          : campaign
      );
    } else if (type === 'ad' && campaignId && adSetId && itemId) {
      updatedCampaigns = updatedCampaigns.map(campaign => 
        campaign.id === campaignId 
          ? {
              ...campaign,
              adSets: campaign.adSets.map(adSet =>
                adSet.id === adSetId
                  ? { ...adSet, ads: adSet.ads.filter(ad => ad.id !== itemId) }
                  : adSet
              )
            }
          : campaign
      );
    }
    
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const editCampaign = useCallback((campaignId: string, newName: string, iconData?: { name: string; icon: any; color: string }) => {
    const updatedCampaigns = dashboardData.campaigns.map(campaign =>
      campaign.id === campaignId ? { ...campaign, name: newName, iconData } : campaign
    );
    setDashboardData(prev => ({ ...prev, campaigns: updatedCampaigns }));
  }, [dashboardData.campaigns]);

  const editAdSet = useCallback((campaignId: string, adSetId: string, newName: string) => {
    const updatedCampaigns = dashboardData.campaigns.map(campaign =>
      campaign.id === campaignId
        ? {
            ...campaign,
            adSets: campaign.adSets.map(adSet =>
              adSet.id === adSetId ? { ...adSet, name: newName } : adSet
            )
          }
        : campaign
    );
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const editAd = useCallback((campaignId: string, adSetId: string, adId: string, newName: string) => {
    const updatedCampaigns = dashboardData.campaigns.map(campaign =>
      campaign.id === campaignId
        ? {
            ...campaign,
            adSets: campaign.adSets.map(adSet =>
              adSet.id === adSetId
                ? {
                    ...adSet,
                    ads: adSet.ads.map(ad =>
                      ad.id === adId ? { ...ad, name: newName } : ad
                    )
                  }
                : adSet
            )
          }
        : campaign
    );
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const editAdMetric = useCallback((campaignId: string, adSetId: string, adId: string, metricId: string, newName: string, newValue: number, newType: 'sum' | 'average' | 'percentage') => {
    const updatedCampaigns = dashboardData.campaigns.map(campaign =>
      campaign.id === campaignId
        ? {
            ...campaign,
            adSets: campaign.adSets.map(adSet =>
              adSet.id === adSetId
                ? {
                    ...adSet,
                    ads: adSet.ads.map(ad =>
                      ad.id === adId 
                        ? {
                            ...ad,
                            metrics: ad.metrics.map(metric =>
                              metric.id === metricId 
                                ? { ...metric, name: newName, value: newValue, type: newType }
                                : metric
                            )
                          }
                        : ad
                    )
                  }
                : adSet
            )
          }
        : campaign
    );
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const deleteAdMetric = useCallback((campaignId: string, adSetId: string, adId: string, metricId: string) => {
    const updatedCampaigns = dashboardData.campaigns.map(campaign =>
      campaign.id === campaignId
        ? {
            ...campaign,
            adSets: campaign.adSets.map(adSet =>
              adSet.id === adSetId
                ? {
                    ...adSet,
                    ads: adSet.ads.map(ad =>
                      ad.id === adId 
                        ? {
                            ...ad,
                            metrics: ad.metrics.filter(metric => metric.id !== metricId)
                          }
                        : ad
                    )
                  }
                : adSet
            )
          }
        : campaign
    );
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const addAdMetric = useCallback((campaignId: string, adSetId: string, adId: string, name: string, value: number, type: 'sum' | 'average' | 'percentage') => {
    const newMetric: CustomMetric = {
      id: `metric-${Date.now()}`,
      name,
      value,
      type
    };

    const updatedCampaigns = dashboardData.campaigns.map(campaign =>
      campaign.id === campaignId
        ? {
            ...campaign,
            adSets: campaign.adSets.map(adSet =>
              adSet.id === adSetId
                ? {
                    ...adSet,
                    ads: adSet.ads.map(ad =>
                      ad.id === adId 
                        ? { ...ad, metrics: [...ad.metrics, newMetric] }
                        : ad
                    )
                  }
                : adSet
            )
          }
        : campaign
    );
    updateMetrics(updatedCampaigns);
  }, [dashboardData.campaigns, updateMetrics]);

  const toggleMetricSelection = useCallback((metricId: string) => {
    setDashboardData(prev => ({
      ...prev,
      selectedMetricIds: prev.selectedMetricIds.includes(metricId)
        ? prev.selectedMetricIds.filter(id => id !== metricId)
        : [...prev.selectedMetricIds, metricId]
    }));
  }, []);

  const selectAllMetrics = useCallback(() => {
    setDashboardData(prev => ({
      ...prev,
      selectedMetricIds: prev.overviewMetrics.map(m => m.id)
    }));
  }, []);

  const clearAllMetrics = useCallback(() => {
    setDashboardData(prev => ({
      ...prev,
      selectedMetricIds: []
    }));
  }, []);

  return {
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
  };
};