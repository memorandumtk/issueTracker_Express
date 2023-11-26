const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String },
    status_text: { type: String },
    created_on: { type: Date, }, //default is gonna be current time
    updated_on: { type: Date, }, //default is gonna be current time
    open: { type: Boolean, default: true},
    project: { type: Schema.Types.ObjectId, ref: "Project"},
});

// Export model
module.exports = mongoose.model("Issue", IssueSchema);

