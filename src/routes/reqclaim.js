import express from 'express';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator/check';
import { Utils } from '../utils';

export const reqclaimRouter = express.Router();

reqclaimRouter.post(
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
