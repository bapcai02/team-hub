import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const location = useLocation();
  
  // Check if current page is analytics to apply full-screen layout
  const isAnalyticsPage = location.pathname.includes('/analytics');
  
  return (
    <Layout 
      style={{ 
        minHeight: '100vh',
        background: theme === 'dark' ? '#141414' : '#F3F4F6'
      }}
    >
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content 
          style={{ 
            padding: isAnalyticsPage ? '0' : '24px',
            background: theme === 'dark' ? '#141414' : '#F3F4F6',
            transition: 'background-color 0.3s',
            overflow: 'auto'
          }}
          role="main"
          aria-label="Main content"
        >
          {isAnalyticsPage ? (
            children
          ) : (
            <div 
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                minHeight: 'calc(100vh - 120px)'
              }}
            >
              {children}
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
