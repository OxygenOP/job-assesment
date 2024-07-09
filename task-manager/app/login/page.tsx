import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function page() {
  const user = cookies().get("user");
  if (user) {
    redirect("/");
  }

  async function CreateAccount(data: FormData) {
    "use server";
    let user = await fetch(process.env.api + "user/" + data.get("name"), {
      method: "GET",
      cache: "no-cache",
    });
    let userBody = await user.json();
    if (userBody.name) {
      cookies().set("user", JSON.stringify(userBody));
      redirect("/");
    } else {
      console.log("Getting user");
      let createUser = await fetch(process.env.api + "user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.get("name") }),

        cache: "no-cache",
      });

      let userRole = await createUser.json();
      cookies().set("user", JSON.stringify(userRole));
      redirect("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center  p-24">
      <form
        action={CreateAccount}
        className="min-w-[300px] flex flex-col gap-y-4"
      >
        <label htmlFor="name">
          Enter your name to login or create an account
        </label>
        <input
          type="text"
          name="name"
          id="name"
          minLength={3}
          required
          placeholder="Name"
          className="p-2 border border-black rounded-sm"
        />
        <button
          className="w-full border border-black p-2 bg-black text-white rounded hover:bg-white hover:text-black transition-colors"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default page;
