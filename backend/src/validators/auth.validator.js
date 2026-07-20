import { body } from "express-validator";

export const registerValidator = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body("username")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Username must contain at least 4 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 8 characters")

];