import React, { useEffect } from 'react';
import { AppRouter } from './app/router/routes';
import { useSettings } from './utils/storage';
import './styles/theme.css';

const App: React.FC = () => {
  const theme = useSettings().theme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <AppRouter />;
};

export default App;