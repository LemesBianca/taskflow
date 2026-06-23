import express from "express";
import swaggerUi from "swagger-ui-express";

import projectRoutes from "./routes/projectRoutes";
import swaggerSpec from "./swagger";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

export default app;