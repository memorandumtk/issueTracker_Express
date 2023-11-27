# Issue Tracker

This is the boilerplate for the Issue Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker


Create an issue with every field: POST request to /api/issues/{project}
Create an issue with only required fields: POST request to /api/issues/{project}
Create an issue with missing required fields: POST request to /api/issues/{project}
View issues on a project: GET request to /api/issues/{project}
View issues on a project with one filter: GET request to /api/issues/{project}
View issues on a project with multiple filters: GET request to /api/issues/{project}
Update one field on an issue: PUT request to /api/issues/{project}
Update multiple fields on an issue: PUT request to /api/issues/{project}
Update an issue with missing _id: PUT request to /api/issues/{project}
Update an issue with no fields to update: PUT request to /api/issues/{project}
Update an issue with an invalid _id: PUT request to /api/issues/{project}
Delete an issue: DELETE request to /api/issues/{project}
Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
Delete an issue with missing _id: DELETE request to /api/issues/{project}


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

### MongoDB collection drop for test via mongoose
https://stackoverflow.com/a/41906984/21951181  
***Deleting all documents was better.***
https://stackoverflow.com/a/52334060/21951181

### Mongoose deleteOne() retrun value
`{ acknowledged: {boolean value}, deletedCount: {number of deleted item} }`