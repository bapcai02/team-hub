import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
  CalendarOutlined,
  FileOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: t('dashboard'), path: '/' },
    { key: 'projects', icon: <ProjectOutlined />, label: t('projects'), path: '/projects' },
    { key: 'chat', icon: <MessageOutlined />, label: t('chat'), path: '/chat' },
    { 
      key: 'hrm', 
      icon: <UserOutlined />, 
      label: 'Quản lý nhân sự',
      path: '/employees',
      children: [
        { key: 'employees', icon: <TeamOutlined />, label: 'Nhân viên', path: '/employees' },
        { key: 'attendance', icon: <ClockCircleOutlined />, label: 'Chấm công', path: '/attendance' },
        { key: 'leaves', icon: <FileTextOutlined />, label: 'Nghỉ phép', path: '/leaves' },
      ]
    },
    { key: 'schedule', icon: <CalendarOutlined />, label: t('schedule') },
    { key: 'docs', icon: <FileOutlined />, label: t('docs') },
    { key: 'settings', icon: <SettingOutlined />, label: t('settings') },
  ];

  // Tìm selected key cho menu
  const findSelectedKey = (items: any[]): string => {
    for (const item of items) {
      if (item.path && location.pathname.startsWith(item.path)) {
        return item.key;
      }
      if (item.children) {
        const childKey = findSelectedKey(item.children);
        if (childKey) return childKey;
      }
    }
    return 'dashboard';
  };

  const selectedKey = findSelectedKey(menuItems);

  // Tìm open keys cho submenu
  const findOpenKeys = (items: any[]): string[] => {
    const openKeys: string[] = [];
    for (const item of items) {
      if (item.children) {
        const hasActiveChild = item.children.some((child: any) => 
          child.path && location.pathname.startsWith(child.path)
        );
        if (hasActiveChild) {
          openKeys.push(item.key);
        }
      }
    }
    return openKeys;
  };

  const initialOpenKeys = findOpenKeys(menuItems);
  
  // Set openKeys ban đầu nếu chưa có
  useEffect(() => {
    if (openKeys.length === 0) {
      setOpenKeys(initialOpenKeys);
    }
  }, [initialOpenKeys, openKeys.length]);

  // Chuyển đổi menuItems thành format cho Ant Design Menu
  const convertToMenuItems = (items: any[]): any[] => {
    return items.map(item => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: convertToMenuItems(item.children)
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.label
      };
    });
  };

  const menuItemsForAntd = convertToMenuItems(menuItems);

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
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        items={menuItemsForAntd}
        onClick={({ key }) => {
          const findPathByKey = (items: any[], targetKey: string): string | null => {
            for (const item of items) {
              if (item.key === targetKey && item.path) {
                return item.path;
              }
              if (item.children) {
                const path = findPathByKey(item.children, targetKey);
                if (path) return path;
              }
            }
            return null;
          };
          
          const path = findPathByKey(menuItems, key);
          if (path) {
            navigate(path);
          }
        }}
        style={{
          fontSize: 17,
          fontWeight: 700,
          border: 'none',
          flex: 1,
          background: 'transparent',
          overflow: 'hidden',
        }}
      />
    </Layout.Sider>
  );
}
