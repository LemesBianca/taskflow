"use client";

import { useState } from "react";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";

type TaskItem = {
    id: string;
    title: string;
    description?: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    projectId: string;
    subtasks?: Array<{
        id: string;
        title: string;
        status: "TODO" | "IN_PROGRESS" | "DONE";
        priority: "LOW" | "MEDIUM" | "HIGH";
    }>;
};

type ProjectItem = {
    id: string;
    name: string;
    description?: string;
    tasks: TaskItem[];
};

type Props = {
    projects: ProjectItem[];
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
};

export default function ProjectsView({
    projects,
    totalProjects,
    completedProjects,
    inProgressProjects,
}: Props) {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const [openCreate, setOpenCreate] = useState(false);
    const selectedProject = projects.find(
        (project) => project.id === selectedProjectId
    ) ?? null;

    return (
        <>
            <div className="space-y-10">
                <div>
                    <h1 className="text-4xl font-bold">
                        Projects
                    </h1>

                    <p className="text-zinc-500 mt-2">
                        Overview of your projects
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Search project"
                    className="
            w-full
            rounded-full
            border
            px-5
            py-3
            outline-none
          "
                />

                <div className="grid md:grid-cols-4 gap-6">
                    <div className="border rounded-3xl p-6 text-center">
                        <p className="text-zinc-500">All projects</p>

                        <p className="text-4xl font-bold">
                            {totalProjects}
                        </p>
                    </div>

                    <div className="border rounded-3xl p-6 text-center">
                        <p className="text-zinc-500">In progress</p>

                        <p className="text-4xl font-bold">
                            {inProgressProjects}
                        </p>
                    </div>

                    <div className="border rounded-3xl p-6 text-center">
                        <p className="text-zinc-500">Complete</p>

                        <p className="text-4xl font-bold">
                            {completedProjects}
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenCreate(true)}
                        className="
            border rounded-3xl p-6
            text-4xl font-bold
            hover:bg-black hover:text-white
            duration-300
            "
                    >
                        +
                    </button>
                </div>

                <div className="space-y-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => setSelectedProjectId(project.id)}
                        />
                    ))}
                </div>
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={selectedProject !== null}
                onClose={() => setSelectedProjectId(null)}
            />
            <CreateProjectModal
                isOpen={openCreate}
                onClose={() => setOpenCreate(false)}
            />
        </>
    );
}
