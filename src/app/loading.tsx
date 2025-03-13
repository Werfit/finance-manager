import { Spinner } from "@/components/spinner.component";

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <Spinner />
  </div>
);

export default Loader;
