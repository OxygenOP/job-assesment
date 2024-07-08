import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Task from "../components/Task";
import AddTask from "../components/addTask";

export const revalidate = 0;

async function getTasks(userId: string) {
  const tasks = await fetch(process.env.api + "user/task/" + userId, {
    method: "GET",
    cache: "no-cache",
  });

  let tasksData = await tasks.json();

  return tasksData;
}

export default async function Home() {
  const user = cookies().get("user");
  // console.log("H", user?.value);
  if (!user) {
    redirect("/login");
  }
  const userData = await JSON.parse(user.value);
  const tasksData: any = await getTasks(`${userData.id}`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="lg:min-w-[75%] flex flex-col gap-y-4">
        {userData.name && (
          <h2>
            <b>Welcome</b>, {userData.name}
          </h2>
        )}

        <div className="w-full h-[50px] bg-[#EEEEEE] rounded-t-sm flex flex-row justify-between items-center px-4">
          <h3>Tasks</h3>
          <AddTask userId={userData.id} />
        </div>

        <div className="flex flex-col gap-y-6 h-[60dvh] overflow-y-scroll">
          {tasksData.map((item: any) => (
            <Task id={item.id} title={item.title} description={item.body} />
          ))}
        </div>
      </div>
    </main>
  );
}
