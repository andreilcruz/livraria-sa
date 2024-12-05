-- CreateTable
CREATE TABLE `generos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `livros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(100) NOT NULL,
    `autor` VARCHAR(100) NOT NULL,
    `paginas` SMALLINT NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `sinopse` TEXT NULL,
    `capa` VARCHAR(191) NOT NULL,
    `destaque` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `generoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` VARCHAR(36) NOT NULL,
    `nome` VARCHAR(60) NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `senha` VARCHAR(60) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clientes_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propostas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` VARCHAR(36) NOT NULL,
    `livroId` INTEGER NOT NULL DEFAULT 1,
    `mensagem` VARCHAR(255) NOT NULL DEFAULT 'Mensagem padrão',
    `resposta` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `livros` ADD CONSTRAINT `livros_generoId_fkey` FOREIGN KEY (`generoId`) REFERENCES `generos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_livroId_fkey` FOREIGN KEY (`livroId`) REFERENCES `livros`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
