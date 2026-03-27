import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { BaseError } from "./error";
import { globalLimiter } from "./middleware/rateLimiter";
import router from "./routes/index";

const app = express();
app.use("/api/webhooks", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(globalLimiter);
app.use("/api", router);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
export {app}