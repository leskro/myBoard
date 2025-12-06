import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  // Fetch user's teams
  const memberships = await db.teamMember.findMany({
    where: { userId: session.user.id },
    include: { team: true },
  });

  if (memberships.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome to myBoard</h2>
            <p className="text-gray-500 mb-6">You don't have any team yet.</p>
            <Button>Create a Team</Button>
        </div>
    );
  }

  // Redirect to first team for now (Simple MVP flow)
  // redirect(`/dashboard/team/${memberships[0].teamId}`);

  // Or show list of teams
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Your Teams</h2>
            <Button>
                <Plus className="w-4 h-4 mr-2"/> New Team
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memberships.map(({ team }) => (
                <Link key={team.id} href={`/dashboard/team/${team.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle>{team.name}</CardTitle>
                            <CardDescription>Manage projects and boards</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
