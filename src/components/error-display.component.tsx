type ErrorDisplayProps = {
  error: Error;
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="text-muted-foreground text-center italic">
      Error: {error.message}
    </div>
  );
};
