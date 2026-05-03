type ProjectDetailPageProps = {
  readonly params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  await params;
  return null;
}
