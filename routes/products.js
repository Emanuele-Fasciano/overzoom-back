"use strict";
// routes/productRoutes.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// rotta POST per creare un nuovo prodotto
router.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description } = req.body;
        const newProduct = yield prisma.product.create({
            data: {
                name,
                price,
                description,
            },
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante l\'inserimento del prodotto.' });
    }
}));
// rotta GET per ottenere tutti sui prodotti
router.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ottieni tutti i prodotti dal database
        const products = yield prisma.product.findMany({
            where: {
                deleted: false
            }
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante la lettura dei prodotti.' });
    }
}));
// rotta GET per ottenere un prodotto specifico 
router.get('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = Number(req.params.id);
    try {
        // Ottieni il prodotto tramite ID
        const product = yield prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (!product) {
            return res.status(404).json({ error: 'Prodotto non trovato.' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante la lettura del prodotto.' });
    }
}));
// Rotta PUT per l'aggiornamento di un prodotto 
router.put('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = Number(req.params.id);
    const { name, price, description } = req.body;
    try {
        // Verifica se il prodotto esiste
        const existingProduct = yield prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Prodotto non trovato.' });
        }
        // Esegui l'aggiornamento del prodotto
        const updatedProduct = yield prisma.product.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante l\'aggiornamento del prodotto.' });
    }
}));
// Rotta DELETE per eliminare un prodotto
router.delete('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = Number(req.params.id);
    try {
        // Verifico se il prodotto esiste
        const product = yield prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (!product) {
            return res.status(404).json({ error: 'Prodotto non trovato.' });
        }
        // Eseguo la soft-delete del prodotto
        yield prisma.product.update({
            where: { id: productId },
            data: { deleted: true },
        });
        res.status(200).json(productId);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante l\'eliminazione del prodotto.' });
    }
}));
exports.default = router;
