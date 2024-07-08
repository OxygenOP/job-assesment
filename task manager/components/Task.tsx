"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Task({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  const [componentState, setComponentState] = useState<"default" | "edit">(
    "default"
  );

  const [titleState, setTitleState] = useState<string>(title);
  const [bodyState, setBodyState] = useState<string>(description);
  const router = useRouter();

  function edit() {
    if (componentState == "edit") {
      fetch(process.env.NEXT_PUBLIC_api + "task/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: titleState, body: bodyState }),
      });
    }

    setComponentState((prevState) => {
      return prevState == "default" ? "edit" : "default";
    });
  }

  function deleteTask() {
    if (confirm("Confirm Deleting the task " + title)) {
      fetch(process.env.NEXT_PUBLIC_api + "task/" + id, {
        method: "Delete",
      }).then((res) => router.refresh());
    }
  }

  function completed() {
    if (confirm("Confirm marking the task as done: " + title)) {
      fetch(process.env.NEXT_PUBLIC_api + "task/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: true }),
      }).then((res) => router.refresh());
    }
  }

  return (
    <div className="bg-[#EEEEEE] p-4 pt-2 flex justify-between ">
      {" "}
      {componentState == "default" ? (
        <div className="flex-col w-[75%]">
          <h4 className="text-[#363636] text-[16]">{title}</h4>
          <p className="text-[#363636] text-[14px]">{description}</p>
        </div>
      ) : (
        <div className="flex flex-col h-full w-[75%] gap-y-2">
          <label htmlFor="title" className="text-[16px]">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            minLength={3}
            required
            placeholder={titleState}
            onChange={(e) => setTitleState(e.target.value)}
            className="p-1 h-[25px] border border-black rounded-sm"
          />
          <label htmlFor="body" className="text-[16px]">
            Description
          </label>

          <textarea
            name="body"
            id="body"
            placeholder={bodyState}
            rows={4}
            onChange={(e) => setBodyState(e.target.value)}
            className="p-1 border border-black rounded-sm"
          />
        </div>
      )}
      <div className="flex flex-row gap-x-2">
        <button
          className="bg-[#D9D9D9] px-2 p-1"
          onClick={completed}
          type="button"
        >
          Mark as done
        </button>
        <div className="flex flex-col gap-y-1 text-[14px]">
          <button
            className="bg-[#D9D9D9] px-3 p-1"
            onClick={edit}
            type="button"
          >
            {componentState == "default" ? "Edit" : "Save"}
          </button>
          <button
            className="bg-[#D9D9D9] text-red-500 px-3 p-1"
            type="button"
            onClick={deleteTask}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
