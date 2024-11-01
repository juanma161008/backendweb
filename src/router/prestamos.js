import { Router } from "express";

import { metodosprestamos } from "../controller/prestamoscontroller.js";
const router = Router();

router.get('/prestamos',metodosprestamos.getPrestamo)

export default router;