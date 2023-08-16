import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors';
import { validateRequest } from '../middlewares';
import { User } from '../models/user';
import { Password } from '../services/password.service';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must input a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      throw new BadRequestError('Email or password is not correct');
    }

    const passwordMatch = await Password.compare(
      existedUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Email or password is not correct');
    }

    // generate JWT
    const userJwt = jwt.sign(
      { id: existedUser.id, email: existedUser.email },
      process.env.JWT_KEY!
    );

    // store it on session object
    req.session = { jwt: userJwt };

    return res.status(200).json(existedUser);
  }
);

export { router as signinRouter };
