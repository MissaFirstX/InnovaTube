import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export const register = async (data) => {
    const {
        firstName,
        lastName,
        username,
        email,
        password
    } = data;

    // Verificar username
    const usernameExists = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (usernameExists) {
        throw new Error("Username already exists");
    }

    // Verificar email
    const emailExists = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (emailExists) {
        throw new Error("Email already exists");
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        }
    });

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
};