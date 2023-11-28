// routes/productRoutes.ts

import express, { Request, Response } from 'express';
import { PrismaClient, Product } from '@prisma/client';

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

    // calcolo il totale dell'ordine
  function calculateTotal(orderedProducts: any[], products: any[]) {
    let total = 0;

    orderedProducts.forEach(order => {
        const product = products.find(product => product.id === order.id);

        if (product) {
            // Moltiplico la quantità per il prezzo e lo  aggiungo al totale
            total += order.quantity * product.price;
        }
    });

    return total;
}

const totalPrice = calculateTotal(orderedProducts, products);     
    
    const newOrder = await prisma.order.create({
      data: {
        total: totalPrice,
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

    
    res.status(201).json(totalPrice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante l\'inserimento del prodotto.' });
  }

});

// rotta GET per ottenere tutti gli ordini
router.get("/orders", async (req: Request, res: Response) => {
  try {
    
    // Ottieni tutti i prodotti dal database
    const orders = await prisma.order.findMany();
    
    
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante la lettura degli ordini.' });
  }
});

// rotta GET per ottenere un ordine specifico 
router.get('/orders/:id', async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);

  try {
    // Ottieni il prodotto tramite ID
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
          },
          include: {  // includo i dati dei prodotti contenuti nell ordine
            products: {
              include: {
                product: true,
              },
            },
          },
        });



    if (!order) {
      return res.status(404).json({ error: 'ordine non trovato.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante la lettura del prodotto.' });
  }
});

// Rotta DELETE per eliminare un ordine
router.delete('/orders/:id', async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);

 try {
  
  // Elimino l'ordine
  const deletedOrder = await prisma.order.delete({
    where: {
      id: orderId,
    },
  });

  res.status(200).json(deletedOrder);
} catch (error) {
  console.error(`Si è verificato un errore durante l'eliminazione dell'ordine:`, error);
}
});
export default router;