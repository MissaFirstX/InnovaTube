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
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")

];

export const loginValidator = [
    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email"),

    body("username")
        .optional()
        .trim()
        .isLength({ min: 4 })
        .withMessage("Username must contain at least 4 characters"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    body()
        .custom((value) => {
            if (!value.email && !value.username) {
                throw new Error("Email or username is required");
            }
            return true;
        })
];