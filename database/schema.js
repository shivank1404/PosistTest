const mongoose = require('mongoose');
const schema = mongoose.schema;

const Node = new schema({
  // using _id for nodeId
  name: {
    type: String,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: String
  },
  nodeNumber: {
    type: Number
  },
  referenceNodeId: {
  /*
  * parent _id 
  */
    type: schema.Types.ObjectId
  },
  childReferenceNodeId: [{
    type: schema.Types.ObjectId
  }],
  genesisReferenceNodeId: {
    /* parent node null */
    type: schema.Types.ObjectId
  },
  hashValue: {
    type: String
  }
})

module.exports = mongoose.model('Node',Node);