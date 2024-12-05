import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Importando as rotas
import imoveisRoutes from './routes/imoveis';
import clientesRoutes from './routes/clientes';
import propostasRoutes from './routes/propostas';
import adminsRoutes from "./routes/admins";
import livrosRoutes from "./routes/livros";
import generosRoutes from "./routes/generos";

const app = express();
const port = 3004;

// Middleware para processar requisições JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Registrando as rotas

app.use("/generos", generosRoutes);
app.use("/livros", livrosRoutes);
app.use("/imoveis", imoveisRoutes); // Rota para imóveis
app.use("/clientes", clientesRoutes); // Rota para clientes
app.use("/propostas", propostasRoutes); // Rota para propostas
app.use("/admins", adminsRoutes); // Rota para administradores

// Rota padrão para verificar se o servidor está rodando
app.get('/', (req: Request, res: Response) => {
  res.send('API: Sistema de Imobiliária');
});

// Middleware para tratamento genérico de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
