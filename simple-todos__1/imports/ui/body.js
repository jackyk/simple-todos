import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './body.html';
// Using a template
Template.body.helpers({
  tasks() {
    return Tasks.find({});
  },
});
