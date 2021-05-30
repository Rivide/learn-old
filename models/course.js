const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: {type: String, required: true, max: 80},
    articles: [{type: Schema.Types.ObjectId, ref: 'Article'}],
    nodes: [{type: Schema.Types.ObjectId, ref: 'Node'}]
});

CourseSchema.virtual('url').get(function() {
    return '/learn/course/' + this._id;
});

module.exports = mongoose.model('Course', CourseSchema);