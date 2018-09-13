import { Template } from 'meteor/templating';
import {reactiveDict} from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
import './task.js';

import './body.html';
// Using a template

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});
//pass data into the template
Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
   // If hide completed is checked, filter tasks
   // Check the objects in the database that are not checked($ne:true ) add the top first
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
 // Otherwise, return all of the tasks
    // return Tasks.find({});
    // Show newest tasks at the top
   return Tasks.find({}, { sort: { createdAt: -1 } });
  },

  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  // 'submit .new-task'(event) {
    'submit .new-task': function(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  },

    'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },

});
