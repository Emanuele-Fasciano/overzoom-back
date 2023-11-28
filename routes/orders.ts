// routes/productRoutes.ts

import express, { Request, Response } from 'express';
import { PrismaClient, Product } from '@prisma/client';
import Decimal from 'decimal.js';

const router = express.Router();
const prisma = new PrismaClient();

// Creare un nuovo ordine
router.post("/orders", async (req: Request, res: Response) => {
    const { orderedProducts } = req.body;
    

    // estraggo gli id dei prodotti ordinati e li inserisco in un array
    const idsArray: number[] = orderedProducts.map((product: any) => product.id);
    

  try {
    // Utilizzo Prisma per ottenere i prodotti associati agli ID nella idsArray
    const products: Product[] = await prisma.product.findMany({
      where: {
      id: {
        in: idsArray
      },
    },
    });

    

    // recupero il totale dell'ordine
    const total: Decimal = products.reduce((accumulator: Decimal, currentItem: Product) => {
    return accumulator.plus(currentItem.price);
    }, new Decimal(0));

        
    
    const newOrder = await prisma.order.create({
      data: {
        total: total,
      },
    });

    orderedProducts.forEach(async (orderedProduct: any) => {

         const newOrderProduct = await prisma.orderProduct.create({
      data: {
        orderId: newOrder.id,
        productId: orderedProduct.id,
        quantity: orderedProduct.quantity
      },
    });
      
    });

    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante l\'inserimento del prodotto.' });
  }

});



export default router;