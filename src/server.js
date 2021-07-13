import bodyParser from 'body-parser';
import cors from 'cors';
import crypto from 'crypto-js';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator/check';
import { Utils } from './utils';

const app = express();
const Blockchain = require("./blockchain"); 

global.userInfos = {};

// Add middleware to enable CORS
app.use(cors());

// Add middleware to parse the POST data of the body
app.use(bodyParser.urlencoded({ extended: true }));

// Add middleware to parse application/json
app.use(bodyParser.json());

const didRouter = express.Router();

// Add routes
app.use(didRouter);

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let node_id = uuidv4();

didRouter.post(
  '/docclaim',
  [
    check('userPub')
      .not()
      .isEmpty()
      .withMessage('userPub must required'),
    check('userName')
      .not()
      .isEmpty()
      .withMessage('userName must required'),
    check('address1')
      .not()
      .isEmpty()
      .withMessage('address1 must required'),
    check('phone')
      .not()
      .isEmpty()
      .withMessage('phone must required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
    else {
      console.log('--docclaim--', ' req.body:', req.body);

      let didID = '';
      let { userPub, userName, address1, address2, phone } = req.body;

      // let tmpID = 'did:kiki:' + crypto.createHash('sha256').update(userPub).digest('base64');
      console.log('crypto.SHA256 : ', crypto.SHA256(userPub));
      console.log('crypto.SHA256.toString(crypto.enc.Base64) : ', crypto.SHA256(userPub).toString(crypto.enc.Base64));
      console.log('crypto.SHA256.toString(crypto.enc.Hex) : ', crypto.SHA256(userPub).toString(crypto.enc.Hex));
      let tmpID = 'did:kiki:' + crypto.SHA256(userPub).toString(crypto.enc.Hex);
      console.log('tmpID : ', tmpID);

      // 01. query IPFS with tmpID
      // 01-1. if there's returned result with this tmpID then just generate claim doc with user's request
      // 01-2. if not register with new generated tmpID
    
      // tmp. didID = tmpID
      didID = tmpID;

      let didDoc = {};
      didDoc["@context"] = 'https://www.enventkiki.com/did/v1';
      didDoc["id"] = didID;
    
      let didAuth = {};
      didAuth["id"] = didID + '#keys-1';
      didAuth["type"] = '';
      didAuth["controller"] = '';
      // base64 encrypt
      let userPubWords = crypto.enc.Utf8.parse(userPub);
      let userPubBase64 = crypto.enc.Base64.stringify(userPubWords);
      didAuth["publicKeyBase58"] = userPubBase64;
      didDoc["authentication"] = [ didAuth ];
    
      let didService = {};
      // didService["@context"] = 'did:kiki:contexts:example1234';
      didService["id"] = didID + '#address';
      didService["type"] = 'addressSharingService';
      didService["serviceEndpoint"] = "https://www.eventkiki.com/address/12345";
    
      didDoc["service"] = [ didService ];
    
      console.log('didDoc : ', didDoc);
    
      // 02. generate claim document
      // 02-1. encrypt with pubKey
      // 02-2. tmp. save address save claim at mysql DB with raw data by didID
    
      let encUserName = crypto.AES.encrypt(userName, userPub).toString();
      let encAddress1 = crypto.AES.encrypt(address1, userPub).toString();
      let encAddress2 = crypto.AES.encrypt(address2, userPub).toString();
      let encPhone = crypto.AES.encrypt(phone, userPub).toString();
    
      let claimDoc = {};
      claimDoc["id"] = didID;
    
      let claimValue = {};
      claimValue["userName"] = encUserName;
      claimValue["address1"] = encAddress1;
      claimValue["address2"] = encAddress2;
      claimValue["phone"] = encPhone;
      claimDoc["claim"] = claimValue;
    
      console.log('claimDoc : ', claimDoc);
    
      let claimData = {
        'didID'  : didID,
        'claims' : claimDoc
      };
    
      const sequelize = Utils.createConnection();
      const ClaimDocs = sequelize.import('./models/claim_docs');
    
      ClaimDocs.create(claimData)
        .then(claimDocRtn => {
          console.log('success to create claim doc');
          userInfos[didID] = userPub;
          return res.status(201).jsonp(didDoc);
        })
        .catch(err => {
          console.error('fail to create claim doc : ', err);
          return res.status(401).jsonp(err);
        })
        .finally(() => {
          sequelize.close();
        })
    }
  }) 
);

didRouter.post(
  '/reqclaim',
  [
    check('userPri')
      .not()
      .isEmpty()
      .withMessage('userPri must required'),
    check('didID')
      .not()
      .isEmpty()
      .withMessage('didID must required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
    else {
      console.log('--reqclaim--', ' req.body:', req.body);

      let { userPri, didID } = req.body;

      // TODO. verify user public / private process

      // query didID and return encrypted claimDoc
      const sequelize = Utils.createConnection();
      const ClaimDocs = sequelize.import('./models/claim_docs');
    
      ClaimDocs.findOne({
        where : {
          didID : didID
        },
        raw : true
      })
        .then(claimDocRtn => {
          console.log('success to create claim doc : ', claimDocRtn.claims);
          // return res.status(200).send(JSON.stringify(claimDocRtn.claims));
          return res.status(200).jsonp(claimDocRtn.claims);
        })
        .catch(err => {
          console.error('fail to create claim doc : ', err);
          return res.status(404).jsonp(err);
        })
        .finally(() => {
          sequelize.close();
        })
    }
  }) 
);

didRouter.post(
  '/pubclaim',
  [
    check('didID')
      .not()
      .isEmpty()
      .withMessage('didID must required'),
    check('claimDoc')
      .not()
      .isEmpty()
      .withMessage('claimDoc must required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
    else {
      console.log('--pubclaim--', ' req.body:', req.body);

      let { didID, claimDoc } = req.body;

      // 01. TODO. query get didDoc with didID to get user public key value
      // 01-1. tmp. get userPub from global variables
      let userPub = userInfos[didID];
      console.log('userPub : ', userPub);

      // 02. decrypt claimDoc with user public key and get user shipping address and infos.
      let claimJson = JSON.parse(claimDoc);
      let claim = claimJson.claim;
      console.log('claim : ', claim);
      let userName = crypto.AES.decrypt(claim.userName, userPub).toString(crypto.enc.Utf8);
      let address1 = crypto.AES.decrypt(claim.address1, userPub).toString(crypto.enc.Utf8);
      let address2 = crypto.AES.decrypt(claim.address2, userPub).toString(crypto.enc.Utf8);
      let phone = crypto.AES.decrypt(claim.phone, userPub).toString(crypto.enc.Utf8);

      let resultInfo = {
        userName : userName,
        address1 : address1,
        address2 : address2,
        phone    : phone
      };

      console.log('resultInfo : ', resultInfo);

      return res.status(200).jsonp(resultInfo);
    }
  }) 
);




app.get('/', function (req, res) {
  res.send(JSON.stringify(Blockchain.chain));
});

app.get('/chain', function (req, res){
  res.send(JSON.stringify(Blockchain.chain));
});

app.get('/mine', function (req, res){
  var last_proof;
  let last_block = Blockchain.last_block();
  if (last_block == 0) {
    last_proof = 0;
  } else {
    last_proof = last_block.proof;
  }
  var proof = Blockchain.proof_of_work(last_proof);

  /*  
    Add a bitcoin for the miner
    0 in sender means it is being mined (no sender, sender is the blockchain)
    recipient is node ID
  */
  var index = Blockchain.new_transaction(0, node_id, 1);

  let previous_hash = Blockchain.hash(last_block);
  let block = Blockchain.new_block (proof, previous_hash);

  res.send(JSON.stringify(block));
});

app.post('/transactions/new', function (req, res){
  if (req.query.sender === '' || req.query.ammount ==="" || req.query.recipient === "") {
    res.send("Missing values");
    return;
  } 
  let index = Blockchain.new_transaction(req.query.sender, req.query.recipient, req.query.ammount)
  res.send("Transaction will be added to block " + index);
});

app.post('/nodes/register', function (req, res){
  var nodes = req.query.nodes;
  if (nodes === "") {
    res.send("Provide a list of nodes or leave me alone");
  }
  nodes.forEach(element => {
    Blockchain.register_node(element);
  });
  res.send("Nodes will be added to the block ");
});

app.get('/nodes/resolve', function (req, res){
  var replaced = Blockchain.resolve_conflicts();
  res.send(JSON.stringify(Blockchain));
});

var myArgs = process.argv.slice(2)[0];
myArgs = '3303';

console.log('Launching bitnode in port: ', myArgs);

var server = app.listen(myArgs, function(){

}); 