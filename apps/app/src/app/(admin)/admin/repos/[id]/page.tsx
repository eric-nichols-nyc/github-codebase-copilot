import { RepoDetailRootPage } from "@/src/features/projects/components/repo-detail-root-page";

type PageProps = {
  readonly params: Promise<{ id: string }>;
};

export default function AdminRepoDetailPage(props: PageProps) {
  return <RepoDetailRootPage {...props} reposBasePath="/admin/repos" />;
}
