import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { projectId } = await params;

  const project = await db.project.findUnique({
      where: { id: projectId },
      include: { boards: true }
  });

  if (!project) return <div>Project not found</div>;

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
                <p className="text-gray-500">Boards</p>
            </div>
            <Button>
                <Plus className="w-4 h-4 mr-2"/> New Board
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {project.boards.map((board) => (
                <Link key={board.id} href={`/board/${board.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer aspect-[1/1.4] flex flex-col justify-center items-center bg-gray-50 border-2 border-dashed">
                        <div className="text-4xl font-bold text-gray-300 mb-2">{board.format.replace('ISO_', '')}</div>
                        <div className="text-sm font-medium text-gray-900">{board.title}</div>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
