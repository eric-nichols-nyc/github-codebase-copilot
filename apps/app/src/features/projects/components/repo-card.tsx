type RepoCardProps = {
  readonly title: string;
  readonly createdAt: Date | string;
};

function formatCreatedAt(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RepoCard({ title, createdAt }: RepoCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <p className="font-medium text-sm">{title}</p>
      <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
        Created {formatCreatedAt(createdAt)}
      </p>
    </div>
  );
}
