import { z } from "zod";
import { BoardFormat } from "@prisma/client";

// Validation pour créer un projet
export const createProjectSchema = z.object({
  name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(50),
  teamId: z.string(),
  description: z.string().optional(),
});

// Validation pour mettre à jour un projet
// SUPER IMPORTANT : Pas de champ 'name' ici. On ne peut modifier que la description.
export const updateProjectSchema = z.object({
  projectId: z.string(),
  description: z.string().max(500).optional(),
});

// Validation pour créer un Board
export const createBoardSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  projectId: z.string(),
  format: z.nativeEnum(BoardFormat), // Valide que c'est bien un format ISO (A4, A3...)
});
