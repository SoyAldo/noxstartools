import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import HexGenerator from './pages/HexGenerator';
import SparkAnalyzer from './pages/SparkAnalyzer';
import Legal from './pages/Legal';
import Validator from './pages/Validator';
import ServerStatus from './pages/ServerStatus';
import About from './pages/About';
import Sponsors from './pages/Sponsors';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/hex-generator" element={<HexGenerator />} />
            <Route path="/spark-analyzer" element={<SparkAnalyzer />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/validator" element={<Validator />} />
            <Route path="/status" element={<ServerStatus />} />
            <Route path="/about" element={<About />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="*" element={
              <div className="flex items-center justify-center h-full p-8 text-gray-400">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Página no encontrada</h2>
                  <p>La herramienta solicitada no existe.</p>
                </div>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
