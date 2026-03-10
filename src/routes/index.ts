import { Router } from "express";
import apiRoutes from "./api";
import uiRoutes from "./ui";

const router = Router();

router.use("/", uiRoutes);
router.use("/api/v1", apiRoutes);

export default router;
