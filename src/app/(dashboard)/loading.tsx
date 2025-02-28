import { Spinner } from "@/components/spinner.component";

const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default Loading;
