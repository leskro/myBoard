import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProjectSettingsForm } from "@/components/Dashboard/ProjectSettingsForm";

export default async function ProjectSettingsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { projectId } = await params;

  const project = await db.project.findUnique({
      where: { id: projectId },
  });

  if (!project) return <div>Project not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Settings</h2>
        <ProjectSettingsForm
            projectId={project.id}
            initialName={project.name}
            initialDescription={project.description || ""}
        />
    </div>
  );
}
