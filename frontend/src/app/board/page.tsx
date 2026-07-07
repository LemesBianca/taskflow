"use client";

import { startTransition, useEffect, useState } from "react";

import BoardColumn from "@/components/board/BoardColumn";
import TaskModal from "@/components/tasks/TaskModal";

import { getTasks, moveTask } from "@/services/taskService";
import type { Task, TaskStatus } from "@/types/Task";

const BOARD_COLUMNS: Array<{ title: string; status: TaskStatus }> = [
  { title: "Todo", status: "TODO" },
  { title: "In Progress", status: "IN_PROGRESS" },
  { title: "Done", status: "DONE" },
];

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  useEffect(() => {
    void getTasks().then((data) => {
      startTransition(() => {
        setTasks(data);
      });
    });
  }, []);

  function handleTaskUpdated(updatedTask: Task) {
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

    setSelectedTask((currentSelectedTask) =>
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

  function handleTaskDragStart(taskId: string) {
    setDraggedTaskId(taskId);
  }

  function handleTaskDragEnd() {
    setDraggedTaskId(null);
    setDragOverStatus(null);
  }

  async function handleTaskDrop(nextStatus: TaskStatus) {
    if (!draggedTaskId) {
      setDragOverStatus(null);
      return;
    }

    const taskToMove = tasks.find((task) => task.id === draggedTaskId);

    setDraggedTaskId(null);
    setDragOverStatus(null);

    if (!taskToMove || taskToMove.status === nextStatus) {
      return;
    }

    const previousStatus = taskToMove.status;

    setTasks((previousTasks) =>
      previousTasks.map((currentTask) =>
        currentTask.id === draggedTaskId
          ? {
              ...currentTask,
              status: nextStatus,
            }
          : currentTask
      )
    );

    setSelectedTask((currentSelectedTask) =>
      currentSelectedTask?.id === draggedTaskId
        ? {
            ...currentSelectedTask,
            status: nextStatus,
          }
        : currentSelectedTask
    );

    try {
      const updatedTask = await moveTask(draggedTaskId, nextStatus);

      handleTaskUpdated({
        ...taskToMove,
        ...updatedTask,
        status: updatedTask.status ?? nextStatus,
      });
    } catch (error) {
      console.error("Failed to move task on the board", error);

      setTasks((previousTasks) =>
        previousTasks.map((currentTask) =>
          currentTask.id === taskToMove.id
            ? {
                ...currentTask,
                status: previousStatus,
              }
            : currentTask
        )
      );

      setSelectedTask((currentSelectedTask) =>
        currentSelectedTask?.id === taskToMove.id
          ? {
              ...currentSelectedTask,
              status: previousStatus,
            }
          : currentSelectedTask
      );
    }
  }

  const tasksByStatus = BOARD_COLUMNS.reduce<Record<TaskStatus, Task[]>>(
    (groupedTasks, column) => {
      groupedTasks[column.status] = tasks.filter(
        (task) => task.status === column.status
      );

      return groupedTasks;
    },
    {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    }
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
        {BOARD_COLUMNS.map((column) => (
          <BoardColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={tasksByStatus[column.status]}
            onTaskClick={setSelectedTask}
            onTaskDragStart={handleTaskDragStart}
            onTaskDragEnd={handleTaskDragEnd}
            onColumnDragOver={setDragOverStatus}
            onTaskDrop={handleTaskDrop}
            draggedTaskId={draggedTaskId}
            isDragOver={dragOverStatus === column.status}
          />
        ))}

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