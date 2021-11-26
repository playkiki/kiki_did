import crypto from 'crypto-js';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator/check';
import { Utils } from '../utils';

export const docclaimRouter = express.Router();

docclaimRouter.post(
  '/docclaim',
  [
    check('userPub')
      .not()
      .isEmpty()
      .withMessage('userPub must required'),
    check('userName')
      .not()
      .isEmpty()
      .withMessage('userName must required')
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
      console.log('--docclaim--', ' req.body:', req.body);

      const IPSClient = require('ipfs-http-client');
      const ipfs = IPSClient.create(process.env.IPFS_URL);
    try {
        let didID = '';
        let addressYN = false;
        let reviewYN = false;
        let { userPub, userName, address1, address2, phone, productId, reviewCont } = req.body;

        if (address1) {
          if (!phone) {
            rtnBody.errorcode = 'KDE0001';
            rtnBody.errordetail = 'Req. params not existed';
            return res.status(422).jsonp(rtnBody);
          }
          else addressYN = true;
        }
        if (reviewCont) {
          if (!productId) {
            rtnBody.errorcode = 'KDE0001';
            rtnBody.errordetail = 'Req. params not existed';
            return res.status(422).jsonp(rtnBody);
          }
          reviewYN = true;
        }

        const DidDocument = require('./didDocument');                

        // 01. Create DID Document at IPFS
        const CID = require('cids')
        const multihashing = require('multihashing-async')
        const bytesPub = new TextEncoder('utf8').encode(userPub);

        const hashPub = await multihashing(bytesPub, 'sha2-256');
        const hexPub = crypto.SHA256(userPub).toString(crypto.enc.Hex);
  
        let tmpCid = new CID(1, 'dag-pb', hashPub);
        let doc = new DidDocument(ipfs, 'kiki', tmpCid);

        doc.addPublicKey('key-1', 'Secp256k1VerificationKey2018', 'publicKeyHex', hexPub);
        doc.addAuthentication('Secp256k1SignatureAuthentication2018', 'key-1');

        tmpCid = await doc.commit();
        didID = tmpCid.toString();

        // 02. Generate claim document
        // 02-1. Encrypt with pubKey
        // 02-2. Save claim docs to DB with didID

        // 02-3. in case of address
        if (addressYN) {
          let claimDoc = {};
          claimDoc["id"] = didID;

          let encUserName = crypto.AES.encrypt(userName, hexPub).toString();
          let encAddress1 = crypto.AES.encrypt(address1, hexPub).toString();
          let encAddress2 = crypto.AES.encrypt(address2, hexPub).toString();
          let encPhone    = crypto.AES.encrypt(phone, hexPub).toString();
        
          let claimAddressValue = {};
          claimAddressValue["userName"] = encUserName;
          claimAddressValue["address1"] = encAddress1;
          claimAddressValue["address2"] = encAddress2;
          claimAddressValue["phone"] = encPhone;
          claimDoc["claim"] = claimAddressValue;
        
          // console.log('claimAddressDoc : ', claimDoc);
        
          let claimData = {
            'didID'  : didID,
            'claims' : claimDoc
          };

          let errorMsg = await createClaimDoc(claimData);
          if (errorMsg) {
            rtnBody.errorcode = 'KDE0010';
            rtnBody.errordetail = errorMsg;
            return res.status(401).jsonp(err);
          } else {
            rtnBody.success = true;
            rtnBody.result = didID;
            return res.status(201).jsonp(rtnBody);
          }
        }

        // 02-3. in case of review
        if (reviewYN) {
          let claimDoc = {};
          claimDoc["id"] = didID;

          let encProductId = crypto.AES.encrypt(productId, hexPub).toString();
          let encReviewConts = crypto.AES.encrypt(reviewCont, hexPub).toString();

          let claimReviewValue = {};
          claimReviewValue["userName"] = didID;
          claimReviewValue["productId"] = encProductId;
          claimReviewValue["reviewConts"] = encReviewConts;
          claimReviewValue["reviewDate"] = new Date();
          claimDoc["claim"] = claimReviewValue;
        
          // console.log('claimReviewDoc : ', claimDoc);
        
          let claimData = {
            'didID'  : didID,
            'claims' : claimDoc
          };
        
          let errorMsg = await createClaimDoc(claimData);
          if (errorMsg) {
            rtnBody.errorcode = 'KDE0010';
            rtnBody.errordetail = errorMsg;
            return res.status(401).jsonp(err);
          } else {
            rtnBody.success = true;
            rtnBody.result = didID;
            return res.status(201).jsonp(rtnBody);
          }
        }
      } catch (exp) {
        console.error('fail to create claim doc : ', exp);
        rtnBody.errorcode = 'KDE0099';
        rtnBody.errordetail = err;
        return res.status(401).jsonp(err);
      }
    }
  }) 
);

async function createClaimDoc(claimData) {
  const sequelize = Utils.createConnection();
  const ClaimDocs = sequelize.import('../models/claim_docs');

  await ClaimDocs.create(claimData)
    .then(claimDocRtn => {
      console.log('success to create claim doc');
      return;
    })
    .catch(err => {
      console.error('fail to create claim doc : ', err);
      return err;
    })
    .finally(() => {
      sequelize.close();
    });
}