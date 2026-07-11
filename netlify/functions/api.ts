import express from "express";
import serverless from "serverless-http";
import apiRouter from "../../src/api/router";

const app = express();
app.use(express.json());
app.use("/api", apiRouter);
app.use("/.netlify/functions/api", apiRouter);

export const handler = serverless(app);
