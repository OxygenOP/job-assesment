const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());
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
    where: { userId: req.params.id, isCompleted: false },
    orderBy: { created_at: "desc" },
  });
  // console.log(tasks);
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

async function authenticateUser({ userid, token }) {}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email } });
  const isPasswordCorrect = bcrypt.compare(password, user.password);
  if (user && isPasswordCorrect) {
    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.secret,
      { expiresIn: "1h" }
    );

    res.send({
      id: user.id,
      name: user.name,
      email: user.email,
      token: jwtToken,
    });
  } else if (!isPasswordCorrect) {
    return Error("Password doesn't match");
  } else if (!user) {
    return Error("User with the email doesn't exist");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const encryptedPassword = bcrypt.hash(password);

  //Check if user already exists:
  const userEmail = prisma.user.findUnique({ where: { email: email } });
  if (userEmail) {
    return Error("User with email already exists");
  } else {
    const user = await prisma.user.create({
      data: { name, email, password: encryptedPassword },
    });
    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.secret,
      { expiresIn: "1h" }
    );

    res.send({
      id: user.id,
      name: user.name,
      email: user.email,
      token: jwtToken,
    });
  }
});

app.listen(port, () => {
  console.log(`Running app on ${port}`);
});
