"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Origins whitelist
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
};
app.use(cors);
app.get('/', (req, res) => {
    res.send('Hello, Worl!');
});
// Usa il middleware per il parsing del corpo JSON
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use('/api', products_1.default);
app.use('/api', orders_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
