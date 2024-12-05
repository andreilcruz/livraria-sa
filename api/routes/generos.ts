import { PrismaClient } from "@prisma/client"; // Importando Prisma
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

// Rota para criar um novo gênero
router.post("/", async (req, res) => {
  const { nome } = req.body;
  try {
    const novoGenero = await prisma.genero.create({
      data: {
        nome,
      },
    });
    res.status(201).json(novoGenero);
  } catch (error) {
    console.error("Erro ao criar gênero:", error);
    res.status(500).json({ message: "Erro ao criar gênero." });
  }
});

// Rota para listar todos os gêneros
router.get("/", async (req, res) => {
  try {
    const generos = await prisma.genero.findMany();
    res.status(200).json(generos);
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error);
    res.status(500).json({ message: "Erro ao buscar gêneros." });
  }
});

// Rota para atualizar um gênero
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    const generoAtualizado = await prisma.genero.update({
      where: { id: Number(id) },
      data: { nome },
    });
    res.status(200).json(generoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar gênero:", error);
    res.status(500).json({ message: "Erro ao atualizar gênero." });
  }
});

// Rota para deletar um gênero
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.genero.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar gênero:", error);
    res.status(500).json({ message: "Erro ao deletar gênero." });
  }
});

// Nova rota para popular automaticamente os gêneros
router.post("/popular", async (req, res) => {
  const generosPredefinidos = [
    { nome: "Ficção Científica" },
    { nome: "Fantasia" },
    { nome: "Romance" },
    { nome: "Terror" },
    { nome: "Mistério" },
    { nome: "Aventura" },
    { nome: "Histórico" },
    { nome: "Biografia" },
  ];

  try {
    const generosCriados = await prisma.genero.createMany({
      data: generosPredefinidos,
      skipDuplicates: true, // Evita duplicações
    });
    res.status(201).json({ message: "Gêneros adicionados com sucesso!", generosCriados });
  } catch (error) {
    console.error("Erro ao popular gêneros:", error);
    res.status(500).json({ message: "Erro ao popular gêneros." });
  }
});

export default router;
