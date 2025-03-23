import { LogoutButton } from "../[id]/_components/navigation/_components/logout-button.component";
import { ActivityHealth } from "./activity-health.component";

type NavigationProps = {
  toolbar?: React.ReactNode;
  title?: React.ReactNode;
};

export const Navigation: React.FC<NavigationProps> = ({ toolbar, title }) => (
  <nav className="flex items-center justify-between">
    <div className="flex items-center gap-1">{title}</div>

    <div className="flex items-center gap-1">
      <ActivityHealth />
      {toolbar}

      <LogoutButton />
    </div>
  </nav>
);
