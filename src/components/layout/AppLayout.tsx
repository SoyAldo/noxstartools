import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLegal = location.pathname === '/legal';

  // We hide the sidebar on the landing page and legal page for a cleaner look.
  const showSidebar = !isHome && !isLegal;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 pt-16 h-[calc(100vh)]">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden ${showSidebar ? 'lg:ml-64' : ''}`}>
          <div className="flex-1 overflow-y-auto relative flex flex-col h-full">
             <Outlet />
             {(isHome || isLegal) && <Footer />}
          </div>
        </main>
      </div>
    </div>
  );
}
