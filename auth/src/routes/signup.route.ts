import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError, RequestValidationError } from '../errors';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 15 })
      .withMessage('Password must be between 4 and 15 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    return res.status(201).json(user);
  }
);

export { router as signupRouter };
