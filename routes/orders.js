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
// Creare un nuovo ordine
router.post("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderedProducts } = req.body;
    // estraggo gli id dei prodotti ordinati e li inserisco in un array
    const idsArray = orderedProducts.map((product) => product.id);
    try {
        // Utilizzo Prisma per ottenere i prodotti associati agli ID nella idsArray
        const products = yield prisma.product.findMany({
            where: {
                id: {
                    in: idsArray
                },
            },
        });
        // calcolo il totale dell'ordine
        function calculateTotal(orderedProducts, products) {
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
        const newOrder = yield prisma.order.create({
            data: {
                total: totalPrice,
            },
        });
        orderedProducts.forEach((orderedProduct) => __awaiter(void 0, void 0, void 0, function* () {
            const newOrderProduct = yield prisma.orderProduct.create({
                data: {
                    orderId: newOrder.id,
                    productId: orderedProduct.id,
                    quantity: orderedProduct.quantity
                },
            });
        }));
        res.status(201).json(totalPrice);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante l\'inserimento del prodotto.' });
    }
}));
// rotta GET per ottenere tutti gli ordini
router.get("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ottieni tutti i prodotti dal database
        const orders = yield prisma.order.findMany();
        res.status(200).json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante la lettura degli ordini.' });
    }
}));
// rotta GET per ottenere un ordine specifico 
router.get('/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = Number(req.params.id);
    try {
        // Ottieni il prodotto tramite ID
        const order = yield prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante la lettura del prodotto.' });
    }
}));
// Rotta DELETE per eliminare un ordine
router.delete('/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = Number(req.params.id);
    try {
        // Elimino l'ordine
        const deletedOrder = yield prisma.order.delete({
            where: {
                id: orderId,
            },
        });
        res.status(200).json(deletedOrder);
    }
    catch (error) {
        console.error(`Si è verificato un errore durante l'eliminazione dell'ordine:`, error);
    }
}));
exports.default = router;
