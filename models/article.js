const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, max: 100},
        body: {type: String, required: true, max: 2000}
    }
);

ArticleSchema.virtual('url').get(function() {
    return '/learn/article/' + this._id;
});

module.exports = mongoose.model('Article', ArticleSchema);