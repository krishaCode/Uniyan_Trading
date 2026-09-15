const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className={`${sizes[size] || sizes.md} border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin`}
            style={{ borderWidth: 3, borderColor: 'rgba(59,130,246,0.2)', borderTopColor: '#3B82F6' }} />
          <p className="text-secondary text-sm font-medium animate-pulse">Loading TradNex...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizes[size] || sizes.md} rounded-full animate-spin`}
        style={{ borderWidth: 3, borderStyle: 'solid', borderColor: 'rgba(59,130,246,0.2)', borderTopColor: '#3B82F6' }}
      />
    </div>
  );
};

export default LoadingSpinner;
