import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const register = async (data) => {
  const { firstName, lastName, username, email, password } = data;

  // Verificar username
  const usernameExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (usernameExists) {
    throw new Error("Username already exists");
  }

  // Verificar email
  const emailExists = await prisma.user.findUnique({
    where: {
      email,
    },
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
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const login = async (data) => {
  const { email, username, password } = data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        email ? { email } : undefined,
        username ? { username } : undefined,
      ].filter(Boolean),
    },
  });

  if (!user) {
    throw new Error("Invalid email or username or password");
  }

  // Verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or username or password");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  const { password: _, ...userWithoutPassword } = user;

  return {
    ...userWithoutPassword,
    token,
  };
};
