import crypto from 'crypto-js';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator/check';
import { Utils } from '../utils';

export const didRouter = express.Router();

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

    let rtnBody = {};
    rtnBody.success = false;
    rtnBody.errorcode = '';
    rtnBody.errordetail = '';

    if (!errors.isEmpty()) {
      rtnBody.errorcode = 'KDE0001';
      rtnBody.errordetail = 'Req. params not existed';
      return res.status(422).jsonp(rtnBody);
    } else {
      console.log('--reqclaim--', ' req.body:', req.body);

      let { userPri, didID } = req.body;

      // TODO. verify user public / private process

      // Query didID and return encrypted claimDoc
      const sequelize = Utils.createConnection();
      const ClaimDocs = sequelize.import('../models/claim_docs');
    
      ClaimDocs.findOne({
        where : {
          didID : didID
        },
        raw : true
      })
        .then(claimDocRtn => {
          console.log('success to find claim doc : ', claimDocRtn.claims);
          // return res.status(200).send(JSON.stringify(claimDocRtn.claims));
          rtnBody.success = true;
          rtnBody.result = claimDocRtn.claims;
          return res.status(200).jsonp(rtnBody);
        })
        .catch(err => {
          console.error('fail to find claim doc : ', err);
          rtnBody.errorcode = 'KDE0010';
          rtnBody.errordetail = err;
          return res.status(404).jsonp(rtnBody);
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

    let rtnBody = {};
    rtnBody.success = false;
    rtnBody.errorcode = '';
    rtnBody.errordetail = '';

    if (!errors.isEmpty()) {
      rtnBody.errorcode = 'KDE0001';
      rtnBody.errordetail = 'Req. params not existed';
      return res.status(422).jsonp(rtnBody);
    } else {
      console.log('--pubclaim--', ' req.body:', req.body);

      const IPSClient = require('ipfs-http-client');
      const ipfs = IPSClient.create(process.env.IPFS_URL);
      try {
        const DidDocument = require('./didDocument');                

        const CID = require('cids')

        let { didID, claimDoc } = req.body;
  
        // 01. Query - get didDoc with didID to get user public key value
        let tmpCid = new CID(didID);
        let doc = (await DidDocument.load(ipfs, tmpCid))._content;
  
        // console.debug('doc : ', doc);
        let userPub;
        doc.publicKey.forEach(publicKey => {
          if (publicKey.type === 'Secp256k1VerificationKey2018')
            userPub = publicKey.publicKeyHex;
        });
  
        // 02. Decrypt claimDoc with user public key and get user shipping address and infos.
        // let claimJson = JSON.parse(claimDoc);
        // let claim = claimJson.claim;
        let claim = claimDoc.claim;
        // console.log('claim : ', claim);
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
  
        rtnBody.success = true;
        rtnBody.result = resultInfo;
  
        // console.log('rtnBody : ', rtnBody);
  
        return res.status(200).jsonp(rtnBody);
      } catch(exp) {
        console.error('fail to publish claim doc : ', exp);
        rtnBody.errorcode = 'KDE0099';
        rtnBody.errordetail = err;
        return res.status(401).jsonp(err);
      }
    }
  }) 
);
