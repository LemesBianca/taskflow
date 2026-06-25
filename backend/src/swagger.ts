import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description: "Documentacao da API do TaskFlow",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
  tags: [
    { name: "Users", description: "Operacoes de usuarios" },
    { name: "Projects", description: "Operacoes de projetos" },
    { name: "Tasks", description: "Operacoes de tarefas" },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          projectId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateProjectInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
      CreateTaskInput: {
        type: "object",
        required: ["title", "projectId"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          projectId: { type: "string" },
        },
      },
      UpdateTaskInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;