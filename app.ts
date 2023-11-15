import express, { NextFunction, Request, Response } from 'express';
import products from './routes/products'; // Assicurati di specificare il percorso corretto

const app = express();
const port = process.env.PORT || 3000;

const cors = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); // Origins whitelist
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};

app.use(cors);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Worl!');
});

// Usa il middleware per il parsing del corpo JSON
app.use(express.json());

app.use('/api', products); // Puoi specificare il percorso che preferisci per le tue rotte


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

