import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  headerFixed?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  transparentHeader = false,
  showFooter = true,
  className = '',
  headerFixed = false
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header transparent={transparentHeader} />
      
      {/* Main Content */}
      <main 
        className={`flex-1 ${
          transparentHeader ? '' : headerFixed ? 'pt-16' : ''
        } ${className}`}
      >
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  maxWidth = '7xl',
  padding = true,
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${padding ? 'px-4 sm:px-6 lg:px-8 py-8' : ''} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBack
}) => {
  return (
    <Layout showFooter={false} headerFixed>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                ← Volver
              </button>
            )}
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
  title,
  actions
}) => {
  return (
    <Layout headerFixed>
      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
            {sidebar}
          </aside>
        )}
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Dashboard Header */}
          {(title || actions) && (
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                {title && (
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {title}
                  </h1>
                )}
                {actions && (
                  <div className="flex items-center space-x-4">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Dashboard Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Layout; 