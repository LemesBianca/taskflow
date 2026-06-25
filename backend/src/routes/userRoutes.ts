import { Router } from "express";
import { userController } from "../controllers/userController";

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lista todos os usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", userController.getAll);

export default router;