import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import projectRoutes from "./routes/projectRoutes";
import swaggerSpec from "./swagger";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import subtaskRoutes from "./routes/subtaskRoutes";

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
	cors({
		origin: allowedOrigin,
	})
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/subtasks", subtaskRoutes);

export default app;