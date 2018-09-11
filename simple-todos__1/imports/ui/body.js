import { Template } from 'meteor/templating';
import {reactiveDict} from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
import './task.js';

import './body.html';
// Using a template

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  tasks() {
    // return Tasks.find({});
    // Show newest tasks at the top
   return Tasks.find({}, { sort: { createdAt: -1 } });
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
