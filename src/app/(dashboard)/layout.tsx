import { LayoutProps } from "@/shared/types/layout.type";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="px-4 py-8">{children}</div>;
};

export default Layout;
