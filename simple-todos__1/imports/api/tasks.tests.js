/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
// import { Accounts } from 'meteor/'

import {Tasks} from './tasks.js';
 
if (Meteor.isServer) {
  describe('Tasks', function() {
    describe('methods', function() {
        const userId = Random.id();
        let taskId;

        beforeEach( function() {
            // clear your test database (collection)
          Tasks.remove({});
        //   now insert a new item
          taskId = Tasks.insert({
            text: 'test task',
            createdAt: new Date(),
            owner: userId,
            username: 'tmeasday',
          });
        });

        // remove
        it('can delete owned task', function() {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        // checks and tests this function in api/tasks.js 
        // Set up a fake method invocation that looks like what the method expects
        // returns the value : takes all the things it needs and create a mock and tests if the function creates it
        const invocation = { userId , taskId};
        console.log(invocation, taskId);
 
        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskId]);
 
        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });

//  check if item is checked
      it('Item has been checked', function(){
        // let checked = false;
        const checked = Meteor.server.method_handlers['tasks.setChecked'];
        const invocation = { userId };
        console.log(invocation);
        checked.apply( invocation,[taskId, false]);
        assert.equal(Tasks.find({checked : false}).count(), 1);
      });


      it('This is your private account', function(){
        const private = Meteor.server.method_handlers['tasks.setPrivate'];
        const invocation = { userId };
        console.log(invocation);
        private.apply( invocation,[taskId, true]);
        assert.equal(Tasks.find({private : true}).count(), 1);
      });
      // to insert
      it('Item has been inserted', function(){
        let text= "Reading";
        const insertion = Meteor.server.method_handlers['tasks.insert'];
        const invocation = {userId};
        console.log(invocation, text);
        insertion.apply( invocation, [ text]);
        assert.equal(Tasks.find().count(), 2);

      });
      // User is logged In cannot insert task
      // Can delete their own task
      // Cannot delete other users task
      // Can set checked personal task
      // Cannot set someone else's task as checked
      // Can set Private
      // Cannot set someone elses task as Private
        
    });
});
} 


