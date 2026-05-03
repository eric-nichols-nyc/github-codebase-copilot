import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { ProjectSelectRow } from "@/lib/db/schema";

type RepoArchitectureNotesProps = {
  readonly project: ProjectSelectRow;
};

function Section({
  title,
  body,
}: {
  readonly title: string;
  readonly body: string | null | undefined;
}) {
  if (body === null || body === undefined || body.trim() === "") {
    return null;
  }
  return (
    <Card>
      <CardHeader className="px-3 pt-3 pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
          {body}
        </p>
      </CardContent>
    </Card>
  );
}

export function RepoArchitectureNotes({ project }: RepoArchitectureNotesProps) {
  const hasAny =
    (project.architectureNotes?.trim() ?? "") !== "" ||
    (project.challenges?.trim() ?? "") !== "" ||
    (project.lessonsLearned?.trim() ?? "") !== "";

  if (!hasAny) {
    return (
      <p className="text-muted-foreground text-sm">
        Architecture notes, challenges, and lessons are empty. You can extend
        the schema-backed editor later; for now this tab is a placeholder for
        long-form write-ups.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Section body={project.architectureNotes} title="Architecture" />
      <Section body={project.challenges} title="Challenges" />
      <Section body={project.lessonsLearned} title="Lessons learned" />
    </div>
  );
}
