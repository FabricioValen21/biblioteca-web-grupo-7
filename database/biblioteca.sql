CREATE DATABASE IF NOT EXISTS biblioteca_web;
USE biblioteca_web;

DROP TABLE IF EXISTS prestamos;
DROP TABLE IF EXISTS libros;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') DEFAULT 'usuario',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion DATE NULL,
    estado ENUM('pendiente', 'prestado', 'devuelto') DEFAULT 'pendiente',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (libro_id) REFERENCES libros(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO libros (titulo, autor, categoria, cantidad)
VALUES
('Cien años de soledad', 'Gabriel García Márquez', 'Novela', 5),
('El principito', 'Antoine de Saint-Exupéry', 'Literatura', 3),
('Clean Code', 'Robert C. Martin', 'Programación', 2),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 'Clásico', 4),
('Introducción a JavaScript', 'Autor académico', 'Programación Web', 6);