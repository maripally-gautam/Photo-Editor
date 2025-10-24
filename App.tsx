import React, { Suspense } from 'react';
import { isConfigured } from './services/config';
import { ConfigurationError } from './components/ConfigurationError';
import { Loader } from './components/Loader';

const AppContent = React.lazy(() => import('./AppContent'));

const App: React.FC = () => {
    if (!isConfigured) {
        return <ConfigurationError />;
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader message="Loading Studio..." /></div>}>
            <AppContent />
        </Suspense>
    );
};

export default App;
