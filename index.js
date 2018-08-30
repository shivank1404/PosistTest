const express = require('express');
const mongoose = require('mongoose');
const { encryptValue, decryptValue, hashValue } = require('./Helper/hash')
const Node = require('./database/schema');

var path    = require("path");
const app = express();


/*
@dbu setting arbitary url for mongodb 
*/
const dbu = 'mongodb://online/posisttestingdatabase';
mongoose.connect(dbu,function(err){
	if(err)
	{
		console.log(err);
	}
	else{
		console.log('connected to database');
	}
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/', async (req, res) => {
  try{
    const { 
      data,
      name,
      childrenname,
      parentname,
      genesisname
    } = req.body;

    if(!childrenname) {
      res.status(400).json({status: false, message: 'children name cannot be empty, create children name or else send No children'})
    }
    if(!parentname) {
      res.status(400).json({status: false, message: 'Parent name cannot be empty, create parent name or else send No parent'})
    }
    if(!genesisname) {
      res.status(400).json({status: false, message: 'genesis name cannot be empty, create genesis name or else send No genesis'})
    }
    childrenarray = childrenname.split(",");
    const referenceNodeIdPromise = Node.findOneAndUpdate({name: parentname,name: parentname},{_id:1});

    const childReferenceNodeIdPromise = Node.find({name: { $in: childrenarray ,name: childrenarray[0]},{_id:1}});

    const genesisReferenceNodeIdPromise = Node.findOne({name: genesisname},{name: genesisname},{_id:1});

    const [referenceNodeId, childReferenceNodeId, genesisReferenceNodeId ] = await Promise.all([       childReferenceNodeIdPromise, childReferenceNodeIdPromise, genesisReferenceNodeId
    ]);

    const encryptData = encryptValue(data)
    const toHash = `${Date.now()}${data}${referenceNodeId}${childReferenceNodeId}${genesisReferenceNodeId}`
    const hash = hashValue(toHash)

    let newNode = new Node({
      data:encryptData,
      name
      referenceNodeId,
      childReferenceNodeId,
      genesisReferenceNodeId,
      hash
    })
    newNode = await newNode.save();
    res.send(200).json({status: true, data: newNode})
  }
  catch(err) {
    if(err.code == 11000) {
      res.status(400).json({status: false, message: 'Name is used already'})  
    }
    res.status(504).json({status: false, message: 'something went wrong'})
  }
})

app.get(/:name, async (req, res) => {
  try {
    const Nodefound = await Node.findOne({name: req.params.name});
    res.status(200).json({status: true, data: Nodefound})
  }
  catch(err) {
    res.status(404).json({status: false, message: 'Not Found'})
  }
})

app.listen(3000, () => {
  console.log('server started');
});