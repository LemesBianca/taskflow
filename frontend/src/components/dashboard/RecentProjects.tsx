"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectModal from "@/components/projects/ProjectModal";

type Project = {
  id: string;
  name: string;
  description?: string;
  tasks: {
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
  }[];
};

type Props = {
  projects: Project[];
};

export default function RecentProjects({
  projects,
}: Props) {
  const [currentProjects, setCurrentProjects] = useState<Project[]>(projects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentProjects(projects);
  }, [projects]);

  const selectedProject = useMemo(
    () => currentProjects.find((project) => project.id === selectedProjectId) ?? null,
    [currentProjects, selectedProjectId]
  );

  return (
    <>
      <div className="bg-white rounded-3xl p-8 border border-zinc-300">

        <h2 className="text-2xl font-bold mb-8">
          Recent Projects
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {currentProjects.slice(0, 3).map((project) => {

            const inProgress = project.tasks.filter(
              task => task.status === "IN_PROGRESS"
            ).length;

            const completed = project.tasks.filter(
              task => task.status === "DONE"
            ).length;

            return (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProjectId(project.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedProjectId(project.id);
                  }
                }}
                className="border rounded-3xl p-8 flex flex-col items-center hover:shadow-xl duration-300 text-center"
              >
                <h3 className="text-3xl font-bold mb-8">
                  {project.name}
                </h3>

                <div className="space-y-2 text-center text-xl">
                  <p>
                    {inProgress} tasks in progress
                  </p>

                  <p>
                    {completed} tasks completed
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </div>

      <ProjectModal
        key={selectedProject?.id ?? "closed-project"}
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProjectId(null)}
        onProjectUpdated={(updatedProject) => {
          setCurrentProjects((previousProjects) =>
            previousProjects.map((currentProject) =>
              currentProject.id === updatedProject.id
                ? updatedProject
                : currentProject
            )
          );
        }}
      />
    </>
  );
}