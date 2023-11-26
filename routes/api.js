'use strict';
const { object } = require("mongoose/lib/utils");
const Issue = require("../models/issue");
const Project = require("../models/project");

module.exports = function (app) {

  // Set up mongoose connection
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", true);
  const mongoDB = process.env.MONGODB_URI;
  main().catch((err) => console.log(err));
  async function main() {
    mongoose.connect(mongoDB);
  }

  // Request Handler section from here
  // Creating project called from issueCreate
  const projectCreate = async (project) => {
    // if project name is not existed in projects collection...
    const checkObj = await Project.findOne({ name: project }).exec();
    if (checkObj == null) {
      const projectObj = new Project({
        name: project,
      });
      // projectObj.issues.push(issueId);
      console.log(projectObj)
      await projectObj.validate();
      projectObj.save();
      // } else {
      //   checkObj.issues.push(issueId)
      //   console.log(checkObj)
      //   await checkObj.validate();
      //   checkObj.save();
      // }
    }
  }

    // Post method creating issue
    const issueCreate = async (req, res, next) => {
      let project = req.params.project;
      let projectObj = await projectCreate(project);
      const reqIssue = req.body;
      const issueObj = new Issue({
        issue_title: reqIssue.issue_title,
        issue_text: reqIssue.issue_text,
        created_by: reqIssue.created_by,
        assigned_to: reqIssue.assigned_to,
        status_text: reqIssue.status_text,
        created_on: Date.now(),
        updated_on: Date.now(),
        open: reqIssue.open,
        project: projectObj._id 
      });
      try {
        await issueObj.validate()
        issueObj.save();
        console.log(issueObj);
        res.send({ "assigned_to": issueObj.assigned_to, "status_text": issueObj.status_text, "open": issueObj.open, "_id": issueObj._id, "issue_title": issueObj.issue_title, "issue_text": issueObj.issue_text, "created_by": issueObj.created_by, "created_on": issueObj.created_on, "updated_on": issueObj.updated_on })
      } catch (error) {
        res.send({ error: 'required field(s) missing' });
        // res.send({ error: 'required field(s) missing' });
      }
    }

    // GEt method
    const issueGet = async (req, res, next) => {
      let project = req.params.project;
      try {
        let findPro = await Project
          .findOne({ name: project })
          .populate('issues')
          .exec();
        // Send reuqest based on the value of query
        let query = req.query;
        if (Object.keys(query).length === 0) {
          res.send(findPro.issues);
        } else {
          let queryResult = [];
          for (let key of Object.keys(query)) {
            for (let pro of findPro.issues) {
              if (pro[key] === (query[queryString])) {
                queryResult.push(pro)
              }
            }
          }
          // console.log(queryResult);
          res.send(queryResult);
        }
      } catch {
        next()
      }
    }

    // PUT method for closing issue
    const issueClose = async (req, res) => {
      const project = req.params.project;
      const reqId = { _id: req.body._id };
      const reqOpen = { open: req.body.open };
      const updatedOn = { updated_on: Date.now() };
      if (await Issue.findOne({ _id: reqId })) {
        const closeIssue = await Issue
          .findOneAndUpdate(reqId, updatedOn, { new: true })
          .findOneAndUpdate(reqId, reqOpen, { new: true })
        console.log(closeIssue)
        res.send({ "result": "successfully updated", "_id": req.body._id })
      }
    }
    const issueDelete = async (req, res) => {
      const project = req.params.project;
      const reqId = { _id: req.body._id };
      const deleteIssue = await Issue
        .findOneAndDelete(reqId)
      console.log(deleteIssue);
      res.send({ "result": "successfully deleted", "_id": req.body._id })
    }
    // DELETE method for deleting issue

    // End of Handler section

    app.route('/api/issues/:project')
      .get(async function (req, res, next) {
        issueGet(req, res, next);
      })

      .post(async function (req, res, next) {
        issueCreate(req, res, next);
      })

    // .put(function (req, res) {
    //   issueClose(req, res);
    // })

    // .delete(function (req, res) {
    //   issueDelete(req, res);
    // });

    app.route('/api/issues/delete/issues')
      .delete(function (req, res, next) {
        try {
          Issue.collection.drop()
          console.log('Deleted successfully')
          res.send('Deleted successfully')
        } catch (err) {
          next(err);
        }
      })
    app.route('/api/issues/delete/projects')
      .delete(function (req, res, next) {
        try {
          Project.collection.drop()
          console.log('Deleted successfully')
          res.send('Deleted successfully')
        } catch (err) {
          next(err);
        }
      })
  };
