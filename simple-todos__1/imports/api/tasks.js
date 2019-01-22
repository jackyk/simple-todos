import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
// Making it available to the whole environment
 //last tasks is the name of the file that we are manipulating 
export const Tasks = new Mongo.Collection('tasks');

if(Meteor.isServer){
    // This code runs on the server
    Meteor.publish('tasks', function tasksPublication(){
        return Tasks.find({
            $or:[
                {private: {$ne:true}},
                {owner: this.userId},
            ],
        });
    });
}
Meteor.methods({
    'tasks.insert'(text) {
      check(text, String);
   
      // Make sure the user is logged in before inserting a task
      // if (! Meteor.userId()){
      if (! this.userId) {
        throw new Meteor.Error('not-authorized -- name');
      }
   
      Tasks.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        // owner: Meteor.userId(),
        // username: Meteor.user().username,
        // username: this.username,
        username: Meteor.users.findOne(this.userId).username,
      });
    },
    'tasks.remove'(taskId) {
      check(taskId, String);

      const task = Tasks.findOne(taskId);
      if (task.private && task.owner !== this.userId) {
        // If the task is private, make sure only the owner can delete it
        throw new Meteor.Error('not-authorized');
      }  
   
      Tasks.remove(taskId);
    },


    'tasks.update'(taskId,text){
      check(taskId,String);
      check(text, String);
      
      var task = Tasks.findOne(taskId);
      if(task.private && task.owner !== this.userId){
        throw new Meteor.Error('non-authorized -- make changes');
      }
      Tasks.update(
        taskId,
        {
          $set:{text:text}
        }
      )
    },


    'tasks.setChecked'(taskId, setChecked) {
      check(taskId, String);
      check(setChecked, Boolean);
      
      const task = Tasks.findOne(taskId);
      if (task.private && task.owner !== this.userId) {
        // If the task is private, make sure only the owner can check it off
        throw new Meteor.Error('not-authorized');
      }
   
      Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);
     
        const task = Tasks.findOne(taskId);
     
        // Make sure only the task owner can make a task private
        if (task.owner !== this.userId) {
          throw new Meteor.Error('not-authorized -- Should be private');
        }
     
        Tasks.update(taskId, { $set: { private: setToPrivate } });
      },
  });