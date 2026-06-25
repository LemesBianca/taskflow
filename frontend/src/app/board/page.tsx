"use client";

import { useEffect, useState } from "react";

import BoardColumn from "@/components/board/BoardColumn";
import TaskModal from "@/components/tasks/TaskModal";

import { getTasks } from "@/services/taskService";

export default function BoardPage() {

  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  function handleTaskUpdated(updatedTask: any) {
    setTasks((previousTasks) =>
      previousTasks.map((currentTask) =>
        currentTask.id === updatedTask.id
          ? {
              ...currentTask,
              ...updatedTask,
            }
          : currentTask
      )
    );

    setSelectedTask((currentSelectedTask: any) =>
      currentSelectedTask?.id === updatedTask.id
        ? {
            ...currentSelectedTask,
            ...updatedTask,
          }
        : currentSelectedTask
    );
  }

  function handleTaskDeleted(taskId: string) {
    setTasks((previousTasks) =>
      previousTasks.filter((currentTask) => currentTask.id !== taskId)
    );
    setSelectedTask(null);
  }

  const todo = tasks.filter(
    (task) => task.status === "TODO"
  );

  const inProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  );

  const done = tasks.filter(
    (task) => task.status === "DONE"
  );

  return (
    <div className="space-y-10">

      <div>

        <h1 className="text-4xl font-bold">
          Board
        </h1>

        <p className="text-zinc-500 mt-2">
          Kanban overview of your tasks
        </p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <BoardColumn
          title="Todo"
          tasks={todo}
          onTaskClick={setSelectedTask}
        />

        <BoardColumn
          title="In Progress"
          tasks={inProgress}
          onTaskClick={setSelectedTask}
        />

        <BoardColumn
          title="Done"
          tasks={done}
          onTaskClick={setSelectedTask}
        />

      </div>

      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdated={handleTaskUpdated}
        onDeleted={handleTaskDeleted}
      />

    </div>
  );
}