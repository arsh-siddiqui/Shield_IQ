export default function Input({ label, icon: Icon, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
        )}
        <input
          className={`w-full rounded-xl border border-slate-200 bg-white ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-50 outline-none transition ${className}`}
          {...props}
        />
      </div>
      {error && <span className="block text-xs text-danger mt-1.5">{error}</span>}
    </label>
  );
}
