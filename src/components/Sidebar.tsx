import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
  CalendarOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  LaptopOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  DollarOutlined,
  CreditCardOutlined,
  RiseOutlined,
  UsergroupAddOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: t('dashboard.title'), path: '/' },
    { key: 'analytics', icon: <RiseOutlined />, label: t('analytics.title'), path: '/analytics' },
    { key: 'projects', icon: <ProjectOutlined />, label: t('projects'), path: '/projects' },
    { key: 'chat', icon: <MessageOutlined />, label: t('chat'), path: '/chat' },
    { key: 'meetings', icon: <VideoCameraOutlined />, label: 'Meetings', path: '/meetings' },
    { key: 'calendar', icon: <CalendarOutlined />, label: t('calendar.title'), path: '/calendar' },
    { key: 'documents', icon: <FileTextOutlined />, label: t('docs'), path: '/documents' },
    { key: 'guests', icon: <UsergroupAddOutlined />, label: t('guest.management.title'), path: '/guests' },
    { key: 'notifications', icon: <BellOutlined />, label: t('notifications.management.title'), path: '/notifications' },
    { key: 'settings', icon: <SettingOutlined />, label: t('settings'), path: '/settings' },
    { 
      key: 'devices', 
      icon: <LaptopOutlined />, 
      label: 'Quản lý thiết bị',
      children: [
        { key: 'devices-list', icon: <LaptopOutlined />, label: 'Danh sách thiết bị', path: '/devices' },
        { key: 'devices-categories', icon: <AppstoreOutlined />, label: 'Danh mục thiết bị', path: '/devices/categories' },
        { key: 'devices-stats', icon: <BarChartOutlined />, label: 'Thống kê thiết bị', path: '/devices/stats' },
      ]
    },
    { 
      key: 'hrm', 
      icon: <UserOutlined />, 
      label: 'Quản lý nhân sự',
      children: [
        { key: 'employees', icon: <TeamOutlined />, label: 'Nhân viên', path: '/employees' },
        { key: 'attendance', icon: <ClockCircleOutlined />, label: 'Chấm công', path: '/attendance' },
        { key: 'leaves', icon: <FileTextOutlined />, label: 'Nghỉ phép', path: '/leaves' },
        { key: 'holidays', icon: <CalendarOutlined />, label: 'Ngày nghỉ lễ', path: '/holidays' },
      ]
    },
    { 
      key: 'finance', 
      icon: <DollarOutlined />, 
      label: 'Quản lý tài chính',
      children: [
        { key: 'payroll', icon: <FileTextOutlined />, label: 'Tính lương', path: '/finance/payroll' },
        { key: 'expenses', icon: <CreditCardOutlined />, label: 'Chi phí', path: '/finance/expenses' },
        { key: 'salary-components', icon: <AppstoreOutlined />, label: 'Thành phần lương', path: '/finance/salary-components' },
      ]
    },
    { key: 'settings', icon: <SettingOutlined />, label: t('settings') },
    { key: 'rbac', icon: <SafetyCertificateOutlined />, label: t('rbac.title') || 'Access Control', path: '/rbac' },
    { key: 'contracts', icon: <FileTextOutlined />, label: t('contract.management.title') || 'Contract Management', path: '/contracts' },
  ];

  // Tìm selected key cho menu - sửa logic này
  const findSelectedKey = (items: any[]): string => {
    const currentPath = location.pathname;
    
    // Kiểm tra exact match trước
    for (const item of items) {
      if (item.path === currentPath) {
        return item.key;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === currentPath) {
            return child.key;
          }
        }
      }
    }
    
    // Nếu không có exact match, kiểm tra startsWith
    for (const item of items) {
      if (item.path && currentPath.startsWith(item.path)) {
        return item.key;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path && currentPath.startsWith(child.path)) {
            return child.key;
          }
        }
      }
    }
    
    return 'dashboard';
  };

  const selectedKey = findSelectedKey(menuItems);
  const findOpenKeys = (items: any[]): string[] => {
    const openKeys: string[] = [];
    const currentPath = location.pathname;
    
    for (const item of items) {
      if (item.children) {
        const hasActiveChild = item.children.some((child: any) => 
          child.path && currentPath.startsWith(child.path)
        );
        if (hasActiveChild) {
          openKeys.push(item.key);
        }
      }
    }
    return openKeys;
  };

  const initialOpenKeys = findOpenKeys(menuItems);
  
  // Set openKeys ban đầu nếu chưa có - SỬA LỖI INFINITE LOOP
  useEffect(() => {
    const newOpenKeys = findOpenKeys(menuItems);
    if (JSON.stringify(newOpenKeys) !== JSON.stringify(openKeys)) {
      setOpenKeys(newOpenKeys);
    }
  }, [location.pathname]); // Chỉ dependency vào location.pathname

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
      } else {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label
        };
      }
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
