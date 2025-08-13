import { useState, useEffect } from 'react';
import { CustomTheme } from '@/components/dashboard/ThemeCustomizer';

const defaultTheme: CustomTheme = {
  primary: '0 0% 9%',
  secondary: '0 0% 90%',
  background: '0 0% 98%',
  foreground: '0 0% 9%',
  accent: '0 0% 85%',
};

export const useTheme = () => {
  const [theme, setTheme] = useState<CustomTheme>(() => {
    const stored = localStorage.getItem('dashboard-theme');
    return stored ? JSON.parse(stored) : defaultTheme;
  });

  const [dashboardTitle, setDashboardTitle] = useState(() => {
    return localStorage.getItem('dashboard-title') || 'Dashboard de Tráfego Pago';
  });

  const [dashboardDescription, setDashboardDescription] = useState(() => {
    return localStorage.getItem('dashboard-description') || 'Gerencie suas campanhas, conjuntos e anúncios';
  });

  const [companyLogo, setCompanyLogo] = useState(() => {
    return localStorage.getItem('company-logo') || '';
  });

  useEffect(() => {
    // Aplicar o tema às variáveis CSS
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--accent', theme.accent);
    
    // Salvar no localStorage
    localStorage.setItem('dashboard-theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dashboard-title', dashboardTitle);
  }, [dashboardTitle]);

  useEffect(() => {
    localStorage.setItem('dashboard-description', dashboardDescription);
  }, [dashboardDescription]);

  useEffect(() => {
    localStorage.setItem('company-logo', companyLogo);
  }, [companyLogo]);

  return {
    theme,
    setTheme,
    dashboardTitle,
    setDashboardTitle,
    dashboardDescription,
    setDashboardDescription,
    companyLogo,
    setCompanyLogo,
  };
};