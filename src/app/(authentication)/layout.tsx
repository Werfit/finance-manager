import { LayoutProps } from "@/shared/types/layout.type";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="mx-auto max-w-96 px-4 py-72">{children}</div>;
};

export default Layout;
