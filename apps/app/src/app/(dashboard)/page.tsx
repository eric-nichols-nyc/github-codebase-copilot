const leftRows = Array.from({ length: 36 }, (_, i) => ({
  key: `left-row-${i + 1}`,
  title: `Left item ${i + 1}`,
  body: "Placeholder copy for the left column. Scroll only moves this side.",
}));

const rightRows = Array.from({ length: 28 }, (_, i) => ({
  key: `right-row-${i + 1}`,
  title: `Right block ${i + 1}`,
  body: "Placeholder copy for the right column. Scroll only moves this side.",
}));

export default function DashboardHomePage() {
  return (
    <div className="flex h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] min-h-0 w-full overflow-hidden">
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain border-r p-4">
        <p className="mb-4 font-medium text-sm">Left panel</p>
        <ul className="space-y-3">
          {leftRows.map(({ key, title, body }) => (
            <li
              key={key}
              className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
            >
              <p className="font-medium text-sm">{title}</p>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain p-4">
        <p className="mb-4 font-medium text-sm">Right panel</p>
        <ul className="space-y-3">
          {rightRows.map(({ key, title, body }) => (
            <li
              key={key}
              className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
            >
              <p className="font-medium text-sm">{title}</p>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
