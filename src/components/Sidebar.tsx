import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
  CalendarOutlined,
  FileOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: t('dashboard'), path: '/' },
    { key: 'staff', icon: <TeamOutlined />, label: t('team') },
    { key: 'projects', icon: <ProjectOutlined />, label: t('projects'), path: '/projects' },
    { key: 'chat', icon: <MessageOutlined />, label: t('chat'), path: '/chat' },
    { key: 'schedule', icon: <CalendarOutlined />, label: t('schedule') },
    { key: 'docs', icon: <FileOutlined />, label: t('docs') },
    { key: 'settings', icon: <SettingOutlined />, label: t('settings') },
  ];
  const selectedKey =
    menuItems
      .filter(item => item.path)
      .sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0))
      .find(item => location.pathname.startsWith(item.path!))
      ?.key || 'dashboard';

  return (
    <Layout.Sider
      width={240}
      style={{
        background: 'linear-gradient(160deg, #f8fafd 60%, #e6eaff 100%)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: 'none',
        boxShadow: '2px 0 16px #0001',
        padding: 0,
      }}
    >
      <div
        className="logo"
        style={{
          padding: '28px 0 18px 0',
          fontSize: 22,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4B48E5',
          letterSpacing: 2,
          textShadow: '0 4px 16px #4B48E540',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 0 8px #4B48E5AA)',
            marginRight: 10,
          }}
        >
          {/* SVG logo 3 màu */}
          <svg width="40" height="40" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="180" y="220" width="120" height="580" rx="32" fill="#4B48E5"/>
            <rect x="452" y="120" width="120" height="680" rx="32" fill="#00d4ff"/>
            <rect x="724" y="320" width="120" height="480" rx="32" fill="#ffb347"/>
          </svg>
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span
            style={{
              background: 'linear-gradient(90deg, #4B48E5 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: 2,
              textShadow: '0 2px 8px #4B48E540',
            }}
          >
            Team
          </span>
          <span
            style={{
              background: 'linear-gradient(90deg, #ffb347 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: 2,
              textShadow: '0 2px 8px #4B48E540',
              marginLeft: 2,
            }}
          >
            Hub
          </span>
        </span>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{
          fontSize: 17,
          fontWeight: 700,
          border: 'none',
          flex: 1,
          background: 'transparent',
          overflow: 'hidden',
        }}
      >
        {menuItems.map(item => (
          <Menu.Item
            key={item.key}
            icon={
              <span
                style={{
                  fontSize: 32,
                  color: selectedKey === item.key ? '#fff' : '#4B48E5',
                  background: selectedKey === item.key
                    ? 'linear-gradient(90deg, #4B48E5 60%, #7f7fff 100%)'
                    : 'transparent',
                  borderRadius: 10,
                  padding: 6,
                  marginRight: 14,
                  transition: 'all 0.2s',
                  boxShadow: selectedKey === item.key ? '0 4px 16px #4B48E540' : undefined,
                  filter: selectedKey === item.key ? 'drop-shadow(0 0 8px #4B48E5AA)' : undefined,
                }}
              >
                {item.icon}
              </span>
            }
            style={{
              borderRadius: 12,
              margin: '10px 14px',
              background: selectedKey === item.key
                ? 'linear-gradient(90deg, #4B48E5 60%, #7f7fff 100%)'
                : 'transparent',
              color: selectedKey === item.key ? '#fff' : '#222',
              boxShadow: selectedKey === item.key ? '0 4px 16px #4B48E540' : undefined,
              fontWeight: selectedKey === item.key ? 900 : 700,
              transition: 'all 0.2s',
              overflow: 'hidden',
            }}
            onClick={() => item.path && navigate(item.path)}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Layout.Sider>
  );
}
