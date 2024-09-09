import {Schema, model} from 'mongoose';

const TaskSchema = new Schema(
  {
    user: String,
    title: String,
    description: String,
  },
);

const Task = model('Task', TaskSchema);

export default Task;