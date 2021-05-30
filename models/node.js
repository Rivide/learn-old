const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NodeSchema = new Schema({
  x: { type: Number },
  y: { type: Number },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
  next: [{ type: Schema.Types.ObjectId, ref: 'Node' }]
});

module.exports = mongoose.model('Node', NodeSchema);