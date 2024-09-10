import express from 'express';
import mongoose from "mongoose";
import Task from '../models/Task';
import auth, {RequestWithUser} from '../middleware/auth';

const taskRouter = express.Router();

taskRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const tasks = await Task.find({user: req.user?._id});
    return res.send(tasks);
  } catch (e) {
    next(e);
  }
});

taskRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const task = new Task({
      user: req.user?._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
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

taskRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.params.id) {
      res.status(400).send({error: "ID must be in url"});
    }

    if (req.user?._id) {

      const task = await Task.findById(req.params.id);

      if (task && task.user.toString() === req.user._id.toString()) {

        if (req.body.user) {
          return  res.status(400).send({error: "User field not must be in request"});
        } else if (!['new', 'in_progress', 'complete'].includes(req.body.status)) {
          return  res.status(400).send({error: "Status not correct."});
        } else {
          const updateTask = await Task.findOneAndUpdate({_id: req.params.id}, req.body);
          if (updateTask) await updateTask.save();

          return res.send(updateTask);
        }

      } else {
        return res.status(403).send({error: 'You cannot edit a task that is not yours'})
      }
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
});

taskRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({error: 'ID must be in url'});
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send({error: 'Task not found'});
    }

    if (task.user.toString() !== req.user?._id.toString()) {
      return res.status(403).send({error: 'You cannot delete a task that is not yours' });
    }

    await Task.deleteOne({_id: req.params.id});

    return res.send("Task deleted");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
});

export default taskRouter