"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AddTask({ userId }: { userId: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  function close() {
    setTitle("");
    setDescription("");
    setErrorMessage("");

    setIsVisible(false);
  }

  function createTask() {
    if (title != "") {
      fetch(process.env.NEXT_PUBLIC_api + "task/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title, body: description, userId }),
      }).then((res) => {
        close();
        router.refresh();
      });
    } else {
      setErrorMessage("Title is required");
    }
  }

  return (
    <div>
      <div
        onClick={() => setIsVisible(true)}
        className="px-3 py-1 hover:cursor-pointer rounded-sm bg-[#D7D7D7]"
      >
        {" "}
        +{" "}
      </div>

      {isVisible && (
        <div className="absolute left-0 top-0 flex justify-center items-center w-screen h-screen">
          <div
            className=" absolute z-5  w-screen h-screen bg-black bg-opacity-75"
            onClick={close}
          ></div>

          <div className="relative z-10 bg-white rounded-md min-w-[300px] min-h-[400px] lg:min-w-[55%]  p-4 flex flex-col">
            <h1 className="text-[24px]">Add Task</h1>
            <div>
              <div className="flex flex-col h-full min-w-[300px] gap-y-2 mt-10">
                <label htmlFor="title" className="text-[16px]">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  minLength={3}
                  required
                  placeholder={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-1 h-[35px] border border-black rounded-sm"
                />
                <label htmlFor="body" className="text-[16px]">
                  Description
                </label>
                <textarea
                  name="body"
                  id="body"
                  rows={5}
                  placeholder={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-1 border border-black rounded-sm"
                />
                <button
                  className="w-full border border-black p-2 bg-black text-white rounded hover:bg-white hover:text-black transition-colors"
                  type="submit"
                  onClick={createTask}
                >
                  Create Task
                </button>{" "}
                {errorMessage != "" && (
                  <div className="w-full bg-red-300 text-white p-2 py-1 text-[14px] rounded ">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
