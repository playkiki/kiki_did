import cors from 'cors';
import crypto from 'crypto-js';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator/check';
import { Utils } from './utils';
import { create } from "ipfs-http-client";
import { config } from './config';

const app = express();

const DidDocument = require('./didDocument');
const ipfs = create(process.env.IPFS_URL);

const CID = require('cids')
const multihashing = require('multihashing-async')

global.userInfos = {};

// Add middleware to enable CORS
app.use(cors());

// Add middleware to parse the POST data of the body
app.use(express.urlencoded({ extended: true }));

// Add middleware to parse application/json
app.use(express.json());

const didRouter = express.Router();

// Add routes
app.use(didRouter);

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
      let doc;

      // 01. create DID Document at IPFS
      const bytesPub = new TextEncoder('utf8').encode(userPub);
      const hashPub = await multihashing(bytesPub, 'sha2-256');
      let tmpCid = new CID(1, 'dag-pb', hashPub);
      let doc = new DidDocument(ipfs, 'kiki', tmpCid);
    
      const hexPub = crypto.SHA256(userPub).toString(crypto.enc.Hex);
      doc.addPublicKey('key-1', 'Secp256k1VerificationKey2018', 'publicKeyHex', hexPub);
      doc.addAuthentication('Secp256k1SignatureAuthentication2018', 'key-1');
    
      tmpCid = await doc.commit();
      didID = doc.DID;

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

