import express from 'express';
import mongoose from "mongoose";
import Task from '../models/Task';
import auth, {RequestWithUser} from '../middleware/auth';

const taskRouter = express.Router();

taskRouter.post('/', auth, async (req: RequestWithUser, res, next) => {

  try {
    const task = new Task({
      user: req.user?.user,
      title: req.body.title,
      description: req.body.description,
    });

    await task.save();
    return res.send(task);

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
});

taskRouter.get('/', async (req, res, next) => {
  try {
    const task = await Task.find();
    return res.send(task);

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
});

export default taskRouter