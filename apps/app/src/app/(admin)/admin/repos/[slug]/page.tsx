import { RepoDetailRootPage } from "@/src/features/projects/components/repo-detail-root-page";

type PageProps = {
  readonly params: Promise<{ slug: string }>;
};

export default async function AdminRepoDetailPage(props: PageProps) {
  return <RepoDetailRootPage {...props} reposBasePath="/admin/repos" />;
}
