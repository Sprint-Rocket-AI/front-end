export const LoadingSpinner = () => {
  return (
    <div className="flex h-full w-full items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-slate-300" />
    </div>
  );
};
