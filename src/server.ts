import "reflect-metadata";
import express from "express";
import cors from "cors";

import { AppDataSource } from "./database/data-source";

import usuariosRoutes from "./routes/usuarios.routes";
import medicamentosRoutes from "./routes/medicamentos.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/usuarios", usuariosRoutes);
app.use("/medicamentos", medicamentosRoutes);


AppDataSource.initialize()
  .then(async () => {
    console.log("Sua conexão com banco de dados está ok");
    app.listen(3333, () => {
      console.log("Servidor rodando na porta 3333");
    });
  })
  .catch(() => console.log("Erro ao conectar com o banco de dados"));