import { PrismaClient } from "@prisma/client"; // Importa o Prisma Client
import { Router } from "express"; // Importa o Router do Express

const prisma = new PrismaClient(); // Instancia o Prisma Client
const router = Router(); // Instancia o Router do Express

// Rota para listar todos os livros
router.get("/", async (req, res) => {
  try {
    const livros = await prisma.livro.findMany({
      include: {
        genero: true, // Inclui o gênero associado ao livro
      },
    });
    res.status(200).json(livros);
  } catch (error) {
    console.error("Erro ao listar livros:", error);
    res.status(500).json({ erro: "Erro ao listar livros." });
  }
});

// Rota para criar um novo livro
router.post("/", async (req, res) => {
    const { generoId, titulo, autor, preco, paginas, capa, sinopse } = req.body;
  
    // Validação básica
    if (!generoId || !titulo || !autor || !preco || !paginas || !capa || !sinopse) {
      console.error("Dados inválidos recebidos:", req.body);
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
  
    try {
      const novoLivro = await prisma.livro.create({
        data: {
          generoId: Number(generoId), // Converte para número
          titulo,
          autor,
          preco: parseFloat(preco), // Converte para decimal
          paginas: parseInt(paginas, 10), // Converte para inteiro
          capa,
          sinopse,
        },
      });
  
      res.status(201).json(novoLivro);
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      res.status(500).json({ error: "Erro ao criar o livro no servidor." });
    }
  });
  

// Rota para deletar um livro por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const livroDeletado = await prisma.livro.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(livroDeletado);
  } catch (error) {
    console.error("Erro ao deletar livro:", error);
    res.status(500).json({ erro: "Erro ao deletar livro." });
  }
});

// Rota para atualizar um livro por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { generoId, titulo, autor, preco, paginas, capa, sinopse } = req.body;

  // Validação de campos obrigatórios
  if (!generoId || !titulo || !autor || !preco || !paginas || !capa || !sinopse) {
    return res.status(400).json({ erro: "Campos obrigatórios estão faltando!" });
  }

  try {
    const livroAtualizado = await prisma.livro.update({
      where: { id: Number(id) },
      data: {
        generoId,
        titulo,
        autor,
        preco,
        paginas,
        capa,
        sinopse,
      },
    });
    res.status(200).json(livroAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    res.status(500).json({ erro: "Erro ao atualizar livro." });
  }
});

// Rota de pesquisa de livros por termo (título, autor ou preço)
router.get("/pesquisa/:termo", async (req, res) => {
    const { termo } = req.params;
  
    // Converte o termo para minúsculas
    const termoLower = termo.toLowerCase();
  
    try {
      const livros = await prisma.livro.findMany({
        include: {
          genero: true,
        },
        where: {
          OR: [
            // Compara usando lower-case
            { titulo: { contains: termoLower } },
            { autor: { contains: termoLower } },
          ],
        },
      });
      res.status(200).json(livros);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      res.status(500).json({ erro: "Erro ao buscar livros." });
    }
  });

// Rota para obter um livro específico por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const livro = await prisma.livro.findUnique({
      where: { id: Number(id) },
      include: {
        genero: true,
      },
    });
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }
    res.status(200).json(livro);
  } catch (error) {
    console.error("Erro ao buscar livro:", error);
    res.status(500).json({ erro: "Erro ao buscar livro." });
  }
});

export default router;
