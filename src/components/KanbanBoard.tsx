import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumContainer from "./ColumContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  const columnsID = useMemo(() => columns.map((col) => col.id), [columns]);
  // active column for the DND overlay
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  //Active Task for the DND overlay

  const [activeTask, setActiveTask] = useState<Task | null>();

  // add the tasks tothe Kanban /board
  const [tasks, setTasks] = useState<Task[]>([]);

  //Create New COlumn
  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  // Generate and ID fro 1 to 1000
  function generateId() {
    return Math.floor(Math.random() * 1000);
  }

  // Delete the column
  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }
  // Update the title of the column
  function updateColumn(id: Id, title: string) {
    const newTitle = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newTitle);
  }

  function OnDragStart(event: DragStartEvent) {
    console.log(event);
    // const { active, over } = event;

    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (overColumnId === activeColumnId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId,
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId,
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  //function to drag over the tasks

  function onDragOVer(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (overColumnId === activeColumnId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = active.data.current?.type === "task";

    if (!isActiveTask) return;

    // when a Task is over the taks on the same column

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeColumnId);
        const overIndex = tasks.findIndex((t) => t.id === overColumnId);

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // when a Task is over the task on another column

    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeColumnId);

        tasks[activeIndex].columnId = overColumnId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  //distinguish the drag from the click

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        // delay: 250,
        // tolerance: 5,
      },
    }),
  );

  //function to create Tasks

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  //function to delete the Tasks

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((tas) => tas.id !== id);
    setTasks(newTasks);
  }

  // function to update Task Content

  function updateTaskContent(id: Id, content: string) {
    const newTask = tasks.map((tas) => {
      if (tas.id !== id) return tas;
      return { ...tas, content };
    });
    setTasks(newTask);
  }

  return (
    <div className="m-auto flex min-h-screen  flex-wrap items-center overflow-x-auto overflow-y-hidden p-[40px]">
      <DndContext
        onDragStart={OnDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
        onDragOver={onDragOVer}
      >
        <div className="m-auto flex  gap-2">
          <div className="flex gap-4">
            <SortableContext items={columnsID}>
              {columns.map((col) => (
                <ColumContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  tasks={tasks.filter((tas) => tas.columnId === col.id)}
                  updateTaskContent={updateTaskContent}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="flex
        h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border border-columnBackgroundColor 
        bg-mainBackgroundColor p-4
         transition duration-200 ease-in-out hover:ring-2 hover:ring-rose-500 active:scale-95"
            onClick={() => {
              createNewColumn();
            }}
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {/*  Portal to have the background when I drag */}
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumContainer
                deleteColumn={deleteColumn}
                column={activeColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter((tas) => tas.columnId === activeColumn.id)}
                deleteTask={deleteTask}
                updateTaskContent={updateTaskContent}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTaskContent={updateTaskContent}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
