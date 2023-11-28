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


// rotta GET per ottenere tutti sui prodotti
router.get('/products', async (req: Request, res: Response) => {
  try {
    
    // Ottieni tutti i prodotti dal database
    const products = await prisma.product.findMany();
    
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante la lettura dei prodotti.' });
  }
});

// rotta GET per ottenere un prodotto specifico 
router.get('/products/:id', async (req: Request, res: Response) => {
  const productId = Number(req.params.id);

  try {
    // Ottieni il prodotto tramite ID
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Prodotto non trovato.' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante la lettura del prodotto.' });
  }
});

// Rotta PUT per l'aggiornamento di un prodotto 
router.put('/products/:id', async (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const { name, price, description } = req.body;

  try {
    // Verifica se il prodotto esiste
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Prodotto non trovato.' });
    }

    // Esegui l'aggiornamento del prodotto
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        description,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante l\'aggiornamento del prodotto.' });
  }
});


// Rotta DELETE per eliminare un prodotto
router.delete('/products/:id', async (req: Request, res: Response) => {
  const productId = Number(req.params.id);

  try {
    // Verifico se il prodotto esiste
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Prodotto non trovato.' });
    }

    // Esegui l'eliminazione del prodotto
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    res.status(200).json(productId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Si è verificato un errore durante l\'eliminazione del prodotto.' });
  }
});
export default router;
