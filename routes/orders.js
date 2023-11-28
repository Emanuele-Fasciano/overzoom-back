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
const decimal_js_1 = __importDefault(require("decimal.js"));
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
        // recupero il totale dell'ordine
        const total = products.reduce((accumulator, currentItem) => {
            return accumulator.plus(currentItem.price);
        }, new decimal_js_1.default(0));
        const newOrder = yield prisma.order.create({
            data: {
                total: total,
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
        res.status(201).json(newOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante l\'inserimento del prodotto.' });
    }
}));
exports.default = router;
