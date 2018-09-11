import { Mongo } from 'meteor/mongo';

// Making it available to the whole environment
 //last tasks is the name of the file that we are manipulating 
export const Tasks = new Mongo.Collection('tasks');
