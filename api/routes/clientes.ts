import { Router } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Criar um cliente
router.post("/", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Verificar se o e-mail já existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (clienteExistente) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    // Criar o cliente
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senha, salt);

    const cliente = await prisma.cliente.create({
      data: { nome, email, senha: hash },
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

// Listar todos os clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ error: "Erro ao listar clientes" });
  }
});

// Login do cliente
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (!cliente) {
      return res.status(400).json({ error: "Cliente não encontrado" });
    }

    const senhaValida = bcrypt.compareSync(senha, cliente.senha);

    if (!senhaValida) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    // Retornar os dados necessários, incluindo ID e Nome
    res.json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
    });
  } catch (error) {
    console.error("Erro ao autenticar cliente:", error);
    res.status(500).json({ error: "Erro ao autenticar cliente" });
  }
});

// Obter cliente por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json(cliente);
  } catch (error) {
    console.error("Erro ao obter cliente:", error);
    res.status(500).json({ error: "Erro ao obter cliente" });
  }
});

// Atualizar cliente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: { id },
      data: {
        nome,
        email,
        senha: senha ? bcrypt.hashSync(senha, 10) : undefined,
      },
    });

    res.json(clienteAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

// Excluir cliente
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id }, // Remova o Number()
    });
    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await prisma.cliente.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).json({ error: "Erro ao excluir cliente" });
  }
});

export default router;
