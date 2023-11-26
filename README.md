# Issue Tracker

This is the boilerplate for the Issue Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker


You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.
Waiting:The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.

{
  issue_title: 'l',
  issue_text: 'l',
  created_by: 'l',
  assigned_to: 'l',
  status_text: 'l'
}

    "assigned_to": "",
    "status_text": "teststatus",
    "open": true,
    "_id": "656279b647d8dd0013a1bfab",
    "issue_title": "issuetest",
    "issue_text": "text",
    "created_by": "kosuke",
    "created_on": "2023-11-25T22:48:22.764Z",
    "updated_on": "2023-11-25T22:48:22.764Z"

### Error Handling Reference
https://reflectoring.io/express-error-handling/

### Ajax reference
This site was easy to understand.
https://www.digitalocean.com/community/tutorials/submitting-ajax-forms-with-jquery

### Jquery serialize
https://api.jquery.com/serialize/

### Mongoose `populate`
https://mongoosejs.com/docs/populate.html
I made a bad design schema at first exatly described (here)[https://mongoosejs.com/docs/populate.html#populate-virtuals].

### MongoDB collection delete for test via mongoose
https://stackoverflow.com/a/41906984/21951181

