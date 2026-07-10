import express from "express";
import serverless from "serverless-http";
import apiRouter from "../../src/api/router";

const app = express();
app.use(express.json());

// Mount the API router for standard Express path
app.use("/api", apiRouter);

// Mount the API router for Netlify serverless environment paths
app.use("/.netlify/functions/api", apiRouter);

export const handler = serverless(app);
