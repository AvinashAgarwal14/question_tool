import { Questions } from '/lib/common.js';

Template.combine.onCreated(() => {
  // Checks whether the user has a valid table cookie
  Meteor.call('cookieCheck', Session.get('tablename'), (error, result) => {
    // If not, redirects back to the chooser page
    if (!result) {
      window.location.href = '/';
    } else {
      // Checks whether the current user has admin privileges
      Meteor.call('adminCheck', Session.get('id'), (e, r) => {
        if (!r) {
          // If not, redirects back to the list page
          window.location.href = '/list';
        }
      });
    }
  });
});

Template.combine.onRendered(() => {
  // Sets the document title when the template is rendered
  $('.formcontainer').hide().fadeIn(400);
  $('#darker').hide().fadeIn(400);
  // console.log(Template.instance().data);
});

Template.combine.helpers({
  firsttext() {
    return Questions.findOne({
      _id: Template.instance().data.first,
    }).text.trim();
  },
  secondtext() {
    return Questions.findOne({
      _id: Template.instance().data.second,
    }).text.trim();
  },
});

/* eslint-disable func-names, no-unused-vars */
Template.combine.events({
  // When the submit button is clicked...
  'click .combinesubmitbutton': function (event, template) {
    // Retrieves data from form
    const question = document.getElementById('modifybox').value;
    // Calls the combine function on the server to update the DBs
    const id2 = Template.instance().data.second;
    const id1 = Template.instance().data.first;
    Meteor.call('combine', question, id1, id2, Session.get('id'), (error, result) => {
      // If successful
      if (!error) {
        // Hides the second question (combined -> first)
        Meteor.call('hide', id2, (e, r) => {
          if (!e) {
            // If successful, fade the modal out
            window.location.reload();
          }
        });
      }
    });
  },
  // When enter button is pressed, submit the form
  'keypress #modifybox': function (event, template) {
    // eslint-disable-next-line no-param-reassign
    event.which = event.which || event.keyCode;
    if (event.which === 13) {
      event.preventDefault();
      document.getElementById('submitbutton').click();
    }
  },
  'click #darker': function (event, template) {
    $('.formcontainer').fadeOut(400);
    $('#darker').fadeOut(400, () => {
      Blaze.remove(popoverTemplate);
    });
    window.location.reload();
  },
  'click .closecontainer': function (event, template) {
    window.location.reload();
  },
});

/* eslint-enable func-names, no-unused-vars */
