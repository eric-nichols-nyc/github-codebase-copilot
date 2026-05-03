type FeaturesCardProps = {
  readonly title: string;
  readonly body: string;
};

export function FeaturesCard({ title, body }: FeaturesCardProps) {
  return (
    <li className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <p className="font-medium text-sm">{title}</p>
      <p className="mt-1 text-muted-foreground text-xs leading-relaxed">{body}</p>
    </li>
  );
}
