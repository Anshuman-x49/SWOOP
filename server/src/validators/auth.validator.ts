import { body, validationResult } from "express-validator";

const userRegisterValidator = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];

export { userRegisterValidator };
