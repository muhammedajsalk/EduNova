import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routers from './router';
import './App.css';
import KnowledgeNetworkLoader from './utilis/loaderComponent';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading or fetch initial data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // show loader for 2 seconds (adjust as needed)

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <KnowledgeNetworkLoader />;
  }

  return (
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  );
}

export default React.memo(App);
