import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ConfigProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ConfigProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;