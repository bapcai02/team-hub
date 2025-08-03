import React from 'react';
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileUnknownOutlined
} from '@ant-design/icons';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string): React.ReactNode => {
  if (!fileType) {
    return React.createElement(FileUnknownOutlined, { style: { color: '#8c8c8c' } });
  }
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) {
    return React.createElement(FilePdfOutlined, { style: { color: '#ff4d4f' } });
  }
  
  if (type.includes('doc') || type.includes('docx')) {
    return React.createElement(FileWordOutlined, { style: { color: '#1890ff' } });
  }
  
  if (type.includes('xls') || type.includes('xlsx') || type.includes('csv')) {
    return React.createElement(FileExcelOutlined, { style: { color: '#52c41a' } });
  }
  
  if (type.includes('jpg') || type.includes('jpeg') || type.includes('png') || type.includes('gif') || type.includes('bmp')) {
    return React.createElement(FileImageOutlined, { style: { color: '#faad14' } });
  }
  
  if (type.includes('txt') || type.includes('md') || type.includes('rtf')) {
    return React.createElement(FileTextOutlined, { style: { color: '#722ed1' } });
  }
  
  return React.createElement(FileUnknownOutlined, { style: { color: '#8c8c8c' } });
};

export const getFileTypeName = (fileType: string): string => {
  if (!fileType) {
    return 'Unknown';
  }
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('doc') || type.includes('docx')) return 'Word';
  if (type.includes('xls') || type.includes('xlsx')) return 'Excel';
  if (type.includes('csv')) return 'CSV';
  if (type.includes('jpg') || type.includes('jpeg')) return 'JPEG';
  if (type.includes('png')) return 'PNG';
  if (type.includes('gif')) return 'GIF';
  if (type.includes('txt')) return 'Text';
  if (type.includes('md')) return 'Markdown';
  if (type.includes('rtf')) return 'RTF';
  
  return fileType.toUpperCase();
};

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileType = file.type.toLowerCase();
  return allowedTypes.some(type => fileType.includes(type));
};

export const getMaxFileSize = (): number => {
  // 50MB in bytes
  return 50 * 1024 * 1024;
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = getMaxFileSize();
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}`
    };
  }
  
  return { valid: true };
}; 