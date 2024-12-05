import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

// Rota para listar todos os livros
router.get("/", async (req, res) => {
  try {
    const livros = await prisma.livro.findMany({
      include: {
        genero: true, // Atualizado para incluir a relação com 'gênero'
      },
    });
    res.status(200).json(livros);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Rota para criar um novo livro
router.post("/", async (req, res) => {
  const { generoId, titulo, autor, preco, paginas, capa, sinopse } = req.body;

  if (!generoId || !titulo || !autor || !preco || !paginas || !capa || !sinopse) {
    res.status(400).json({ erro: "Informe generoId, titulo, autor, preco, paginas, capa e sinopse" });
    return;
  }

  try {
    const livro = await prisma.livro.create({
      data: { generoId, titulo, autor, preco, paginas, capa, sinopse },
    });
    res.status(201).json(livro);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Rota para deletar um livro por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const livro = await prisma.livro.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(livro);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Rota para atualizar um livro por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { generoId, titulo, autor, preco, paginas, capa, sinopse } = req.body;

  if (!generoId || !titulo || !autor || !preco || !paginas || !capa || !sinopse) {
    res.status(400).json({ erro: "Informe generoId, titulo, autor, preco, paginas, capa e sinopse" });
    return;
  }

  try {
    const livro = await prisma.livro.update({
      where: { id: Number(id) },
      data: { generoId, titulo, autor, preco, paginas, capa, sinopse },
    });
    res.status(200).json(livro);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Rota de pesquisa de livros por termo (título, autor, preço)
router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params;

  // tenta converter o termo em número
  const termoNumero = Number(termo);

  // se a conversão gerou um NaN (Not a Number)
  if (isNaN(termoNumero)) {
    try {
      const livros = await prisma.livro.findMany({
        include: {
          genero: true,
        },
        where: {
          OR: [
            { titulo: { contains: termo } },
            { autor: { contains: termo } },
          ],
        },
      });
      res.status(200).json(livros);
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    try {
      const livros = await prisma.livro.findMany({
        include: {
          genero: true,
        },
        where: {
          preco: { lte: termoNumero },
        },
      });
      res.status(200).json(livros);
    } catch (error) {
      res.status(400).json(error);
    }
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
    res.status(200).json(livro);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
