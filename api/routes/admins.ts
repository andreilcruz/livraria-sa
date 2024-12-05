import { Router } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Criar um administrador
router.post("/", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const senhaCriptografada = bcrypt.hashSync(senha, 10);

  try {
    const admin = await prisma.admin.create({
      data: { nome, email, senha: senhaCriptografada },
    });
    res.status(201).json(admin);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao criar administrador" });
  }
});

// Listar todos os administradores
router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar administradores" });
  }
});

// Login de administrador
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(400).json({ error: "Administrador não encontrado" });
    }

    const senhaValida = bcrypt.compareSync(senha, admin.senha);

    if (!senhaValida) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    // Retorne os dados necessários, incluindo ID e Nome
    res.json({
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao autenticar administrador" });
  }
});

export default router;
