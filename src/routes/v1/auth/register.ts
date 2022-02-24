import { NextFunction, Request, Response } from 'express';
import Joi, { any } from 'joi';
import fs from 'fs';

const schema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6),
  email: Joi.string()
    .regex(
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required(),
});

const RegisterRequest = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let value: { name: any; password: any; email: any };
  try {
    value = await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid parameters',
      err: error.details,
    });
  }

  const { name, password, email } = value;
  console.log('value', value);

  fs.readFile('users.json', (err, data) => {
    // Catch this!
    if (err) throw err;
    if (data.length == 0) {
      console.log('File is empty!');
      const users = [];
      users.push(value);
      fs.writeFile('users.json', JSON.stringify(users), (err) => {
        if (err) throw err;

        console.log('Users saved!');
        return res.status(200).json({ message: 'successfully register user' });
      });
    } else {
      console.log('File is not empty!');
      const loadedUsers = JSON.parse(data.toString());
      console.log(loadedUsers);
      if (loadedUsers.some((e: any) => e.email === value.email)) {
        return res
          .status(400)
          .json({ error: 'Email is Already exists please use another' });
      }
      loadedUsers.push(value);
      fs.writeFile('users.json', JSON.stringify(loadedUsers), (err) => {
        if (err) throw err;

        console.log('Users saved!');
        return res.status(200).json({ message: 'successfully register user' });
      });
    }
  });
};

export { RegisterRequest };
