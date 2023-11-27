
const Issue = require("../models/issue");
const Project = require("../models/project");

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
    let projectObj;
    // if project name is not existed in projects collection
    const checkObj = await Project.findOne({ name: project }).exec();
    if (checkObj != null) {
        projectObj = checkObj;
    } else {
        projectObj = new Project({
            name: project,
        });
        await projectObj.validate();
        projectObj.save();
    }
    return projectObj;
}

// Post method creating issue
//   const issueCreate = async (req, res, next) => {
exports.issueCreate = async (req, res, next) => {
    let project = req.params.project;
    let projectObj = await projectCreate(project);
    const reqIssue = req.body;
    const issueObj = new Issue({
        issue_title: reqIssue.issue_title,
        issue_text: reqIssue.issue_text,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        created_by: reqIssue.created_by,
        assigned_to: reqIssue.assigned_to,
        open: true,
        status_text: reqIssue.status_text,
        project: projectObj._id
    });
    try {
        await issueObj.validate()
        issueObj.save();
        // console.log(issueObj);
        res.send(issueObj)
    } catch (error) {
        res.send({ error: 'required field(s) missing' });
    }
}

// GET method
exports.issueGet = async (req, res, next) => {
    let project = req.params.project;
    try {
        let findProject = await Project
            .findOne({ name: project })
            .populate('issues')
            .exec();
        res.send(findProject.issues);
    } catch {
        next()
    }
}
// If query parameter is coming, this function is exected
exports.issueGetWithQuery = async (req, res, next) => {
    const project = req.params.project;
    const query = req.query;
    let filter = {};
    for (let q in query) {
        filter[q] = query[q];
    }
    try {
        let findProject = await Project
            .findOne({ name: project })
            .populate('issues')
            .find(filter)
            .exec();
        findProject = await Issue
            .find(filter)
            .exec();
        // console.log(findProject);
        res.send(findProject);
    } catch {
        next()
    }
}

// PUT method for closing issue
exports.issueUpdate = async (req, res, next) => {
    const project = req.params.project;
    if (req.body._id === undefined) {
        res.json({ error: 'missing _id' });
    } else {
        const reqId = req.body._id;
        try {
            let findProject = await Project
                .findOne({ name: project })
            let closeIssue = await Issue
                .findOne({ project: findProject._id, _id: reqId })
                .exec();
            try {
                let queryFlag = false; //flag to call 'no field sent'
                // the case query includes only _id.
                if (Object.keys(req.body).length > 1) {
                    for (let b in req.body) {
                        if (b != '_id' && b in closeIssue === false) {
                            queryFlag = true;
                            break;
                        } else {
                            closeIssue[b] = req.body[b];
                        }
                    }
                } else {
                    queryFlag = true;
                }
                if (queryFlag === false) {
                    closeIssue.updated_on = new Date().toISOString();
                    await closeIssue.save();
                    res.json({ result: 'successfully updated', '_id': reqId });
                } else {
                    res.json({ error: 'no update field(s) sent', '_id': reqId })
                }
            } catch {
                res.json({ error: 'could not update', '_id': reqId });
            }
        } catch {
            res.json({ error: 'could not update', '_id': reqId });
        }
    }
}

// DELETE method for deleting issue
exports.issueDelete = async (req, res) => {
    const project = req.params.project;
    if (req.body._id === undefined) {
        res.json({ error: 'missing _id' });
    } else {
        const reqId = req.body._id;
        try {
            let findProject = await Project
                .findOne({ name: project })
            let deleteIssue = await Issue
                .deleteOne({ project: findProject._id, _id: reqId })
            if (deleteIssue.deletedCount == 0) {
                res.json({ error: 'could not delete', '_id': reqId });
            } else {
                res.json({ result: 'successfully deleted', '_id': reqId });
            }
        } catch (err) {
            console.log(err);
            res.json({ error: 'could not delete', '_id': reqId });
        }
    }
}

// End of Handler section