'use server'

import { db } from "@/lib/db"; // Ton instance Prisma
import { auth } from "@/auth"; // Ta config NextAuth
import { createProjectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");

  // Parsing des données
  const rawData = {
    name: formData.get("name"),
    teamId: formData.get("teamId"),
    description: formData.get("description"),
  };

  const validatedFields = createProjectSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "Champs invalides" };
  }

  const { name, teamId, description } = validatedFields.data;

  // Création
  await db.project.create({
    data: {
      name,
      description,
      teamId,
    },
  });

  revalidatePath(`/dashboard/team/${teamId}`);
}

export async function updateProject(projectId: string, newDescription: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");

  // Note pour Jules : Ici on ne touche JAMAIS au nom.
  // On update seulement la description.
  await db.project.update({
    where: { id: projectId },
    data: {
      description: newDescription,
    },
  });

  revalidatePath(`/dashboard/project/${projectId}`);
}
