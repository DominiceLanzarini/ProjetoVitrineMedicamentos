import { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Medicine } from "../entities/Medicine";

const medicineRouter = Router();

const medicineRepository = AppDataSource.getRepository(Medicine);

//---------------Rotas---------------------

//Rota criação de medicamento
medicineRouter.post("/", async (req: Request, res: Response) => {
  try {
    const medBody = req.body as Medicine;

    if (
      !medBody ||
      !medBody.name ||
      !medBody.quantity ||
      !medBody.userId ||
      !medBody.description
    ) {
      res.status(400).json("Preencha todos os dados!");
      return;
    }

    await medicineRepository.save(medBody);

    res.status(201).json(medBody);
  } catch (ex) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

//Rota de listagem de medicamentos
medicineRouter.get("/", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.headers.userid);

    if (!userId) {
      res.status(400).json("Será necessário informar o userId no header");
      return;
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const skip = page > 1 ? (page - 1) * limit : 0;

    const result = await medicineRepository.find({
      where: {
        userId: userId,
      },
      skip: skip,
      take: limit,
    });

    if (!result) {
      res.status(200).json("Nenhum medicamento encontrado!");
      return;
    }

    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

//Rota encontrar medicamento por ID
medicineRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await medicineRepository.findOne({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!result) {
      res.status(200).json("Nenhum medicamento encontrado!");
      return;
    }

    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

//Rota de listagem de todos os medicamentos
medicineRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const skip = page > 1 ? (page - 1) * limit : 0;

    const result = await medicineRepository.find({
      skip: skip, // 20 - 30
      take: limit,
    });

    if (!result) {
      res.status(200).json("Nenhum medicamento encontrado!");
      return;
    }

    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

//Rota
medicineRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const userId = Number(req.headers.userid);

    if (!userId) {
      res.status(400).json("Será necessário informar o userId no header");
      return;
    }

    const medBody = req.body as Medicine;

    const medicamento = await medicineRepository.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!medicamento) {
      res.status(200).json("Nenhum medicamento encontrado!");
      return;
    }

    // vai copiar os dados que vieram do body para o medicamento que veio do banco
    Object.assign(medicamento, medBody);

    await medicineRepository.save(medicamento);

    res.status(200).json(medicamento);
  } catch (ex) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

//Rota para deletar medicamento
medicineRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const userId = Number(req.headers.userid);

    if (!userId) {
      res.status(400).json("Será necessário informar o userId no header");
      return;
    }

    const medicamento = await medicineRepository.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!medicamento) {
      res.status(200).json("Nenhum medicamento encontrado!");
      return;
    }

    await medicineRepository.remove(medicamento);

    res.status(200).json("Medicamento removido com sucesso!");
  } catch (ex) {
    res.status(500).json("Não foi possível executar a solicitação!");
  }
});

export default medicineRouter;
