// routes/productRoutes.ts

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/products', async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        description,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante l\'inserimento del prodotto.' });
  }
});

export default router;
