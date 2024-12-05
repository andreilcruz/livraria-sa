import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Criar uma nova proposta
router.post("/", async (req, res) => {
  const { clienteId, livroId, mensagem } = req.body;

  if (!clienteId || !livroId || !mensagem) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    // Verificar se o cliente existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    // Verificar se o livro existe
    const livroExistente = await prisma.livro.findUnique({
      where: { id: Number(livroId) },
    });

    if (!livroExistente) {
      return res.status(404).json({ error: "Livro não encontrado." });
    }

    // Criar a proposta
    const proposta = await prisma.proposta.create({
      data: {
        clienteId,
        livroId: Number(livroId),
        mensagem,
      },
    });

    res.status(201).json(proposta);
  } catch (error) {
    console.error("Erro ao criar proposta:", error);
    res.status(500).json({ error: "Erro interno ao criar a proposta." });
  }
});

// Listar todas as propostas
router.get("/", async (req, res) => {
  try {
    const propostas = await prisma.proposta.findMany({
      include: {
        cliente: true,
        livro: true,
      },
    });
    res.json(propostas);
  } catch (error) {
    console.error("Erro ao listar propostas:", error);
    res.status(500).json({ error: "Erro interno ao listar propostas." });
  }
});

// Listar propostas de um cliente específico
router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params;

  try {
    const propostas = await prisma.proposta.findMany({
      where: { clienteId },
      include: {
        livro: true,
      },
    });

    if (!propostas.length) {
      return res.status(404).json({ error: "Nenhuma proposta encontrada para este cliente." });
    }

    res.json(propostas);
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    res.status(500).json({ error: "Erro interno ao buscar propostas." });
  }
});

// Atualizar a resposta de uma proposta
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { resposta } = req.body;

  if (!resposta || resposta.trim() === "") {
    return res.status(400).json({ error: "A resposta não pode estar vazia." });
  }

  try {
    const propostaExistente = await prisma.proposta.findUnique({
      where: { id: Number(id) },
    });

    if (!propostaExistente) {
      return res.status(404).json({ error: "Proposta não encontrada." });
    }

    const propostaAtualizada = await prisma.proposta.update({
      where: { id: Number(id) },
      data: {
        resposta,
        updatedAt: new Date(),
      },
    });

    res.status(200).json(propostaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar a resposta da proposta:", error);
    res.status(500).json({ error: "Erro interno ao atualizar a proposta." });
  }
});

// Deletar uma proposta
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const propostaExistente = await prisma.proposta.findUnique({
      where: { id: Number(id) },
    });

    if (!propostaExistente) {
      return res.status(404).json({ error: "Proposta não encontrada." });
    }

    await prisma.proposta.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar proposta:", error);
    res.status(500).json({ error: "Erro interno ao deletar a proposta." });
  }
});

export default router;
