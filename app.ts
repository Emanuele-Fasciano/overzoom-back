import express, { Request, Response } from 'express';
import products from './routes/products'; // Assicurati di specificare il percorso corretto

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Worl!');
});

// Usa il middleware per il parsing del corpo JSON
app.use(express.json());

app.use('/api', products); // Puoi specificare il percorso che preferisci per le tue rotte


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

