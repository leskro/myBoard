import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { teamId } = await params;

  const team = await db.team.findUnique({
      where: { id: teamId },
      include: { projects: true }
  });

  if (!team) return <div>Team not found</div>;

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{team.name}</h2>
                <p className="text-gray-500">Projects</p>
            </div>
            <Button>
                <Plus className="w-4 h-4 mr-2"/> New Project
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.projects.map((project) => (
                <Link key={project.id} href={`/dashboard/project/${project.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer relative group">
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>{project.description || "No description"}</CardDescription>
                        </CardHeader>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" asChild>
                                 <Link href={`/dashboard/project/${project.id}/settings`}>
                                     <Settings className="w-4 h-4" />
                                 </Link>
                             </Button>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
