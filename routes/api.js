'use strict';
const Issue = require("../models/issue");
const Project = require("../models/project");
const { response } = require("express");
const { issueGet,
  issueGetWithQuery,
  issueCreate,
  issueUpdate,
  issueDelete } = require("../controller/controller")

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(async function (req, res, next) {
      if (Object.keys(req.query).length === 0) {
        issueGet(req, res, next);
      } else {
        issueGetWithQuery(req, res, next);
      }
    })

    .post(async function (req, res, next) {
      issueCreate(req, res, next);
    })

    .put(function (req, res, next) {
      issueUpdate(req, res, next);
    })

    .delete(function (req, res) {
      issueDelete(req, res);
    });


  // Collection delete functions for test and dev.
  app.route('/api/delete/issues')
    .delete(function (req, res, next) {
      try {
        Issue.collection.drop()
        console.log('Deleted successfully')
        res.send('Deleted successfully')
      } catch (err) {
        next(err);
      }
    })
  app.route('/api/delete/projects')
    .delete(function (req, res, next) {
      try {
        Project.collection.drop()
        console.log('Deleted successfully')
        res.send('Deleted successfully')
      } catch (err) {
        next(err);
      }
    })
  app.route('/api/delete')
    .delete(async function (req, res, next) {
      try {
        await Issue.deleteMany({})
        await Project.deleteMany({})
        console.log('Deleted successfully')
        res.status(200).send('Deleted successfully')
      } catch (err) {
        console.log(err)
        next(err);
      }
    })
};
