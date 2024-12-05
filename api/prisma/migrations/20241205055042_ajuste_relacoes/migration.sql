/*
  Warnings:

  - You are about to drop the column `createdAt` on the `livros` table. All the data in the column will be lost.
  - You are about to drop the column `destaque` on the `livros` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `livros` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `livros` DROP COLUMN `createdAt`,
    DROP COLUMN `destaque`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `propostas` ALTER COLUMN `livroId` DROP DEFAULT,
    ALTER COLUMN `mensagem` DROP DEFAULT;
