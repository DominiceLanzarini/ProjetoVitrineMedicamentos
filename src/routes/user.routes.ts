import { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { secretKey, authMiddleware } from "../middlewares/auth";
import jwt from "jsonwebtoken";

const userRoutes = Router();

const userRepository = AppDataSource.getRepository(User);

const salt = "$2b$10$laZm54zq1.2v/CVhwa.kH.";

//-------------Rotas-------------------//

//Criar usuário
userRoutes.get(
  "/protected",
  authMiddleware,
  async (req: Request, res: Response) => {
    console.log("chegou aqui");
    res.status(200).json("chegou aqui 2").end();
  }
);

userRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body || !body.email || !body.name || !body.password) {
      res.status(400).json("Preencha todos os dados!");
      return;
    }

    const user = new User();

    //const salt = await bcrypt.genSalt(10);
    //console.log(salt)

    const senhaCriptografada = await bcrypt.hash(body.password, salt);

    user.name = body.name;
    user.email = body.email;
    user.password = senhaCriptografada;

    const createdUser = await userRepository.save(user);

    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

//Rota para login
userRoutes.post("/login", async (req: Request, res: Response) => {
  const body = req.body;

  const user = await userRepository.findOne({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    res.status(401).json("Usuário não autorizado.");
    return;
  }

  const senhaCriptografada = await bcrypt.hash(body.password, salt);
  if (senhaCriptografada === user.password) {
    const payload = {
      name: user.name,
    };

    // Gera o token
    const token = jwt.sign(
      {
        // expira (exp) em 1h
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: payload,
      },
      secretKey
    );

    res.status(200).json({
      access_token: token
    });
  } else {
    res.status(401).json("Usuário não autorizado.");
  }
});

export default userRoutes;
