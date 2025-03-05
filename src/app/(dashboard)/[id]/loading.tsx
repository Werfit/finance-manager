import { Spinner } from "@/components/spinner.component";

const Loading = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner />
  </div>
);

export default Loading;
