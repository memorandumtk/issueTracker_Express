const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    // issues: [{ type: Schema.Types.ObjectId, ref: "Issue"}]
});

// Export model
module.exports = mongoose.model("Project", ProjectSchema);

