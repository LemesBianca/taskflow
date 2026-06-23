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
  paths: {
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Lista todos os usuarios",
        responses: {
          "200": {
            description: "Lista de usuarios retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
      },
    },
    "/projects": {
      get: {
        tags: ["Projects"],
        summary: "Lista todos os projetos",
        responses: {
          "200": {
            description: "Lista de projetos retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Project" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Projects"],
        summary: "Cria um novo projeto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProjectInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Projeto criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Project" },
              },
            },
          },
        },
      },
    },
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Lista todas as tarefas",
        responses: {
          "200": {
            description: "Lista de tarefas retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Task" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tasks"],
        summary: "Cria uma nova tarefa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Tarefa criada com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
        },
      },
    },
    "/tasks/{id}": {
      put: {
        tags: ["Tasks"],
        summary: "Atualiza o status de uma tarefa",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskStatusInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Tarefa atualizada com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Remove uma tarefa",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": {
            description: "Tarefa removida com sucesso",
          },
        },
      },
    },
  },
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
          status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "DONE"] },
          projectId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
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
          projectId: { type: "string" },
        },
      },
      UpdateTaskStatusInput: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "DONE"] },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;