
import '../index.css';

import Footer from './Footer';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="gridmain">
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;