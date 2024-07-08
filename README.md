# tasks app
 
###Requirements:
Docker
NodeJS

### Steps to run the Backend
Step 1: run the Postgres instance located in backend folder (cd into backend folder) using docker compose
```docker compose up -d ```


Step 2: Install dependencies
```npm i```


Step 3: Migrate prisma schema
```npx prisma migrate dev```

Step 4: Run the server (it's using nodemon)
```npm run dev```


### Steps to run the Frontend
Step 1: cd into the frontend folder and install the dependencies
```npm i ```

Step 2: setup the env files

Step 4: Run
```npm run dev```




Tech Stack:
Nextjs
Docker
ExpressJs
Prisma
Postgres

