'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema } from "@/lib/validations";
import { updateProject } from "@/actions/project";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useTransition } from "react";

// For the form, we can extend the schema or just use a partial for local state
// But we need the initial data (name, description) which comes from server component ideally.
// For MVP, I'll pass props.

interface ProjectSettingsProps {
    projectId: string;
    initialName: string;
    initialDescription?: string;
}

export function ProjectSettingsForm({ projectId, initialName, initialDescription }: ProjectSettingsProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            projectId: projectId,
            description: initialDescription || "",
        },
    });

    function onSubmit(values: z.infer<typeof updateProjectSchema>) {
        startTransition(async () => {
            await updateProject(values.projectId, values.description || "");
            // Show toast
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>Manage your project details.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <FormLabel>Project Name</FormLabel>
                            <Input disabled value={initialName} />
                            <p className="text-sm text-muted-foreground">
                                Le nom du projet ne peut pas être modifié pour garantir l'intégrité des liens.
                            </p>
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
