const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 80 },
    body: { type: String, required: true, max: 2000 }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

ArticleSchema.virtual('url').get(function () {
    return '/learn/article/' + this._id;
});

module.exports = mongoose.model('Article', ArticleSchema);