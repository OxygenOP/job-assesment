const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const port = 3002;

// Creating User

app.post("/user", async (req, res) => {
  const user = await prisma.user.create({ data: { name: req.body.name } });
  res.json({ ...user });
});

// Getting User

app.get("/user/:name", async (req, res) => {
  console.log("T ", req.params.name);
  const user = await prisma.user.findUnique({
    where: { name: req.params.name },
  });
  console.log(user);
  res.json({ ...user });
});

//get your tasks

app.get("/user/task/:id", async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.params.id },
  });
  console.log(tasks);
  res.json(tasks);
});

//create a task

app.post("/task", async (req, res) => {
  const data = req.body;
  const task = await prisma.task.create({
    data: { title: data.title, body: data.body, userId: data.userId },
  });
  res.json({ ...task });
});

// Get a specific task

app.get("/task/:id", async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
  });
  res.json({ ...task });
});

// update a specific task

app.put("/task/:id", async (req, res) => {
  const data = req.body;
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { ...data },
  });
  res.json({ ...task });
});

// deleta a specific task

app.delete("/task/:id", async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Running app on ${port}`);
});
