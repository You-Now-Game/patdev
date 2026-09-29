export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5 2 10.5V21a1 1 0 0 0 1 1h6v-7h6v7h6a1 1 0 0 0 1-1V10.5L12 2.5z" />
        </svg>
      </div>
      <span className="text-lg font-bold text-ink">Patina Studio</span>
    </div>
  );
}
