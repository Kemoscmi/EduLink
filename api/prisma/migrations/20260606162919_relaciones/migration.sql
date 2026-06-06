-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NULL,
    `apellidos` VARCHAR(170) NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `role` ENUM('USER', 'ADMIN', 'TUTOR') NOT NULL DEFAULT 'USER',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PerfilTutor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `tituloProfesional` VARCHAR(300) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `aniosExperiencia` INTEGER NOT NULL DEFAULT 0,
    `modalidad` VARCHAR(100) NOT NULL,
    `ubicacion` VARCHAR(255) NOT NULL,
    `tarifaBase` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `imagenPerfil` VARCHAR(255) NOT NULL DEFAULT 'image-not-found.jpg',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Categoria_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Especialidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Especialidad_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutorId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `precio` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `duracion` INTEGER NOT NULL DEFAULT 0,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL DEFAULT 'PRESENCIAL',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Servicio_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutor_especialidad` (
    `tutorId` INTEGER NOT NULL,
    `especialidadId` INTEGER NOT NULL,

    PRIMARY KEY (`tutorId`, `especialidadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio_especialidad` (
    `servicioId` INTEGER NOT NULL,
    `especialidadId` INTEGER NOT NULL,

    PRIMARY KEY (`servicioId`, `especialidadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `tutorId` INTEGER NOT NULL,
    `servicioId` INTEGER NOT NULL,
    `fechaCita` DATETIME(3) NOT NULL,
    `horaInicio` VARCHAR(50) NOT NULL,
    `horaFin` VARCHAR(50) NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL DEFAULT 'PRESENCIAL',
    `estado` ENUM('PENDIENTE', 'PAGADA', 'REALIZADA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    `comentarioCliente` VARCHAR(200) NOT NULL,
    `comentarioTutor` VARCHAR(255) NULL,
    `montoEstimado` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resena` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citaId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `tutorId` INTEGER NOT NULL,
    `puntuacion` INTEGER NOT NULL DEFAULT 0,
    `comentario` VARCHAR(355) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PerfilTutor` ADD CONSTRAINT `PerfilTutor_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `PerfilTutor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutor_especialidad` ADD CONSTRAINT `tutor_especialidad_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `PerfilTutor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutor_especialidad` ADD CONSTRAINT `tutor_especialidad_especialidadId_fkey` FOREIGN KEY (`especialidadId`) REFERENCES `Especialidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidad` ADD CONSTRAINT `servicio_especialidad_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidad` ADD CONSTRAINT `servicio_especialidad_especialidadId_fkey` FOREIGN KEY (`especialidadId`) REFERENCES `Especialidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `PerfilTutor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `Cita`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `PerfilTutor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
