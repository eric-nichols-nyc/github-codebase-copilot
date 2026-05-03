import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { ProjectSelectRow } from "@/lib/db/schema";

type RepoInterviewTalkingPointsProps = {
  readonly project: ProjectSelectRow;
};

export function RepoInterviewTalkingPoints({
  project,
}: RepoInterviewTalkingPointsProps) {
  const talking = project.interviewTalkingPoints?.trim() ?? "";
  const blurb = project.portfolioBlurb?.trim() ?? "";
  const summary = project.customSummary?.trim() ?? "";

  if (talking === "" && blurb === "" && summary === "") {
    return (
      <p className="text-muted-foreground text-sm">
        No interview talking points, portfolio blurb, or custom summary yet.
        These fields are ready on the project row when you add editing flows.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {summary !== "" ? (
        <Card>
          <CardHeader className="px-3 pt-3 pb-2">
            <CardTitle className="font-medium text-sm">Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
              {project.customSummary}
            </p>
          </CardContent>
        </Card>
      ) : null}
      {blurb !== "" ? (
        <Card>
          <CardHeader className="px-3 pt-3 pb-2">
            <CardTitle className="font-medium text-sm">
              Portfolio blurb
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
              {project.portfolioBlurb}
            </p>
          </CardContent>
        </Card>
      ) : null}
      {talking !== "" ? (
        <Card>
          <CardHeader className="px-3 pt-3 pb-2">
            <CardTitle className="font-medium text-sm">
              Interview talking points
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
              {project.interviewTalkingPoints}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
