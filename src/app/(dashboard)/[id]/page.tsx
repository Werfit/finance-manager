import { PageProps } from "@/shared/types/layout.type";

import { Dashboard } from "./_components/dashboard/dashboard.component";
import { SheetNavigation } from "./_components/navigation/sheet-navigation.component";

const Page: React.FC<PageProps<{ id: string }>> = async ({ params }) => {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <SheetNavigation sheetId={id} />
      <Dashboard sheetId={id} />
    </div>
  );
};

export default Page;
