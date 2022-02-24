import { NextFunction, Request, Response } from 'express';
import Joi, { any } from 'joi';
import fs from 'fs';

const schema = Joi.object({
  password: Joi.string().min(6),
  email: Joi.string()
    .regex(
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required(),
});

const loginRequest = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let value: { password: any; email: any };
  try {
    value = await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid parameters',
      err: error.details,
    });
  }

  const { password, email } = value;
  console.log('value', value);

  fs.readFile('users.json', (err, data) => {
    // Catch this!
    if (err) throw err;
    if (data.length == 0) {
      console.log('File is empty!');
      return res.status(400).json({ error: 'no user exists' });
    } else {
      console.log('File is not empty!');
      const loadedUsers = JSON.parse(data.toString());
      console.log(loadedUsers);
      if (
        loadedUsers.some(
          (e: any) => e.email === value.email && e.password === value.password
        )
      ) {
        return loadedUsers.forEach((element: any) => {
          if (
            element.email === value.email &&
            element.password === value.password
          ) {
            return res.status(200).json({
              message: 'User is successfully login',
              name: element.name,
            });
          }
        });
      }
      if (
        loadedUsers.some(
          (e: any) => e.email === value.email && e.password !== value.password
        )
      ) {
        return res.status(400).json({ error: 'password is incorrect' });
      }
      if (
        loadedUsers.some(
          (e: any) => e.email !== value.email && e.password === value.password
        )
      ) {
        return res.status(400).json({ error: 'email is incorrect' });
      }
    }
  });
};

export { loginRequest };
