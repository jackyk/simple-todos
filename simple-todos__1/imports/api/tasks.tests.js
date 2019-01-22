/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { Accounts } from 'meteor/accounts-base'

import {Tasks} from './tasks.js';
// import { constants } from 'zlib';
 
if (Meteor.isServer) {
  describe('Tasks', function() {
    describe('methods', function() {
        // const userId = Random.id();
        const username ="Jacky Kimani";

        let taskId, userId;

        before( function(){
          // create user if not already created by checking the database
          const user = Meteor.users.findOne({username:username});
          if(!user){
            userId = Accounts.createUser({
              'username' : username,
              'email' : 'jackykimani13@gmail.com',
              'password' : 'Ch@ng3m3',
            });
            } else{
              userId = user._id;
            }
          
        })

        beforeEach( function() {
        // clear your test database (collection)
          Tasks.remove({});
        //   now insert a new item
          taskId = Tasks.insert({
            text: 'test task',
            createdAt: new Date(),
            owner: userId,
            username: 'amOwner',
          });
        });

 //<--------------------------- remove your own task --------------------------->
        it('can delete owned task', function() {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        // checks and tests this function in api/tasks.js 
        // Set up a fake method invocation that looks like what the method expects
        // returns the value : takes all the things it needs and create a mock and tests if the function creates it
        const invocation = {userId};
        // console.log(invocation);
 
        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskId]);
 
        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });

//<---------------------------  check if item is checked --------------------------->
      it('Item has been checked', function(){
        // let checked = false;
        const checked = Meteor.server.method_handlers['tasks.setChecked'];
        const invocation = { userId };
        console.log(invocation);
        checked.apply( invocation,[taskId, true]);
        assert.equal(Tasks.find({checked : true}).count(), 1);
      });

//<---------------------------  private --------------------------->

      it('This is your private account', function(){
        const private = Meteor.server.method_handlers['tasks.setPrivate'];
        const invocation = { userId };
        // console.log(invocation);
        private.apply( invocation,[taskId, true]);
        assert.equal(Tasks.find({private : true}).count(), 1);
      });

//<--------------------------- to insert --------------------------->
      it('Item has been inserted', function(){
        let text= "Reading";
        const insertion = Meteor.server.method_handlers['tasks.insert'];
        const invocation = {userId};
        // console.log(invocation, text);
        insertion.apply( invocation, [ text]);
        assert.equal(Tasks.find().count(), 2);

      });

//<--------------------------- Edit task--------------------------->
it('task has been edited', function(){
  Tasks.update(taskId, {$set: {private : true} });

  const editingUser = Random.id();
  let text = "New task edit";
  const editing = Meteor.server.method_handlers['tasks.update'];
  const taskEdition = {'userId': editingUser};
  // console.log(taskEdition, [text]);
  assert.throws(function(){

  editing.apply(taskEdition, [taskId,text]);
  },  Meteor.Error, 'non-authorized -- make changes');
  
  assert.equal(Tasks.find().count(),1);
});



//<--------------------------- Cannot delete someone else task--------------------------->
      it('cannot delete task that is not yours', function(){
        // set existing task as private
        // let setToPrivate = true;
        Tasks.update(taskId, {$set: { private : true } });

        // generate another random user
        // const userId = Random.id();
        const anotherUserId = Random.id();
        // Try to delete new user taks
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        // create fake userId object for method
        // const fakeUserObject = {userId};
        const fakeUserObject = {'userId': anotherUserId};
        // run test
        // verify exception is thrown
        assert.throws(function(){

        deleteTask.apply(fakeUserObject, [taskId]);

        }, Meteor.Error, 'not-authorized');

        // verify not deleted
        assert.equal(Tasks.find().count(),1)

      });


//<---------------------------cannot check another user's task--------------------------->

      it('cannot check another user task', function(){
        Tasks.update(taskId, {$set: {private : true} });

        const checkUserId =  Random.id();
        const checked = Meteor.server.method_handlers['tasks.setChecked'];
        const fakeChecker = {'userId': checkUserId};

        assert.throws(function(){
          // checks to ensure that the exception is thrown first
        checked.apply(fakeChecker,[taskId, true]); 
        }, Meteor.Error, 'not-authorized')
        
        assert.equal(Tasks.find().count(), 1);
        // assert.equal(Tasks.find({checked : false}).count(), 1);
      });


//<---------------------------Cannot insert task if not logged in  --------------------------->
      it('user not logged in', function(){
        // Tasks.update(taskId, {$set: {private : true} });

        // let notLoggedIn = !this.user
        let text = "check emails";
        const insertion = Meteor.server.method_handlers['tasks.insert'];

        const cannotInsert = { };
        // console.log(cannotInsert);
        assert.throws(function(){
          insertion.apply(cannotInsert, [text]);
        }, Meteor.Error, 'not-authorized -- name' )
        assert.equal(Tasks.find().count(),1)

      });

// <--------------------------- Cannot set someone elses task as Private  --------------------------->
      it('Cannot not set someone else task if private', function(){
        // Tasks.update(taskId, {$set: {private : true} });

        const checkPrivateId = Random.id();
        const bePrivate = Meteor.server.method_handlers['tasks.setPrivate'];
        const notPrivate = {'userId' :checkPrivateId};

        assert.throws(function(){
          bePrivate.apply(notPrivate, [taskId, true]);

        }, Meteor.Error, 'not-authorized -- Should be private')
        // assert.equal(Task.find().count(),1)
        assert.equal(Tasks.find({private : true}).count(), 0);

      });

// < --------------------------- Can delete someone else's public task   --------------------------->
      it('can delete someone else public task', function(){
        // Tasks.update(taskId, {$set: {private: false} });
        const deletePublic = Random.id();
        const delPublic = Meteor.server.method_handlers['tasks.remove'];
        const Public = {userId : deletePublic};
         delPublic.apply(Public, [taskId, true]);
         assert.equal(Tasks.find({private:true}).count(),0);
      })


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


