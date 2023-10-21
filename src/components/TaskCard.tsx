import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface TasksProps {
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, content: string) => void;
  task: Task;
}

const TaskCard = ({ task, deleteTask, updateTaskContent }: TasksProps) => {
  // state to show the button when we hover
  const [mouseIsOver, setMouseIsOver] = useState(false);

  //State to edit the tast content
  const [editMode, setEditMode] = useState(false);

  //function to toggle the edit mode
  function toggleEditMode() {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  }

  // UseSortable from DND kit to add the scroll
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
    disabled: editMode,
  });

  //Style fron dnd kit

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  //IsDraging to sort and make the tasks draggable

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" relative flex h-[100px] min-h-[100px] flex-shrink-0 cursor-grab items-center rounded-xl bg-mainBackgroundColor p-2.5 text-left opacity-50 transition duration-200 ease-in-out  hover:border-2 hover:border-rose-500  "
      />
    );
  }

  //content to return on EditMode
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className=" relative flex h-[100px] min-h-[100px] flex-shrink-0 cursor-grab items-center rounded-xl bg-mainBackgroundColor p-2.5 text-left transition duration-200 ease-in-out hover:ring-2 hover:ring-inset hover:ring-rose-400"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task Content Here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTaskContent(task.id, e.target.value)}
        >
          {" "}
        </textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className=" task relative flex h-[100px] min-h-[100px] flex-shrink-0 cursor-grab items-center rounded-xl bg-mainBackgroundColor p-2.5 text-left transition duration-200 ease-in-out hover:ring-2 hover:ring-inset hover:ring-rose-400"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          className=" absolute right-4 top-1/2 -translate-y-1/2 rounded-xl stroke-white p-2 opacity-60 hover:stroke-rose-500 hover:opacity-100 active:scale-95"
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
