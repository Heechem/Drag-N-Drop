import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
interface ColumnProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, content: string) => void;
}

const ColumContainer = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTaskContent,
}: ColumnProps) => {
  const [editMode, setEditMode] = useState(false);

  //Items for the SortableContext

  const tasksID = useMemo(() => {
    return tasks.map((tas) => tas.id);
  }, [tasks]);

  // UseSortable from DND kit to add the scroll
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" m-h-[450px] flex h-[450px] w-[350px] flex-col rounded-md border-2 border-rose-500 bg-columnBackgroundColor opacity-40"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" m-h-[450px] flex h-[450px] w-[350px] flex-col rounded-md bg-columnBackgroundColor"
    >
      {/* Column title */}
      <div
        className=" text-md flex h-[60px] cursor-grab items-center justify-between rounded-md rounded-b-none border-4 border-columnBackgroundColor bg-mainBackgroundColor p-3 font-bold"
        {...listeners}
        {...attributes}
        onClick={() => setEditMode(true)}
      >
        <div className="flex gap-2">
          <div className="flex items-center justify-center rounded-full bg-columnBackgroundColor px-2 py-1 text-sm">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="rounded border bg-black px-2 outline-none focus:border-rose-500"
              onChange={(e) => updateColumn(column.id, e.target.value)}
              value={column.title}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          className=" stroke-gray-500 px-1 py-2  hover:stroke-white active:scale-95"
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <TrashIcon />
        </button>
      </div>
      {/* column taks container */}
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasksID}>
          {tasks.map((tas) => (
            <TaskCard
              key={tas.id}
              task={tas}
              deleteTask={deleteTask}
              updateTaskContent={updateTaskContent}
            />
          ))}
        </SortableContext>
      </div>
      {/* footer */}
      <button
        className="flex items-center justify-center gap-2 rounded-md border-2 border-columnBackgroundColor border-x-columnBackgroundColor p-4 transition-all duration-200 ease-in-out hover:bg-mainBackgroundColor hover:text-rose-500 active:scale-95"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
};

export default ColumContainer;
