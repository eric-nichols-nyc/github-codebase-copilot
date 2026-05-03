import "server-only";

export async function listProjects(): Promise<never> {
  throw new Error("project-service.listProjects: not implemented");
}
