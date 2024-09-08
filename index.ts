import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors(config.corsOptions));

const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);