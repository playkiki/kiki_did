// kiki/did API TEST Suites

const { expect } = require('chai');
const faker = require('faker/locale/en');
// let setUserPub   = faker.random.arrayElement([ 'userPub1', 'userPub2', 'userPub3', 'userPub4', 'userPub5' ]);
// let setUserPri   = faker.random.arrayElement([ 'userPri1', 'userPri2', 'userPri3', 'userPri4', 'userPri5' ]);
let setUserPub   = faker.random.arrayElement([ 'userPub1' ]);
let setUserPri   = faker.random.arrayElement([ 'userPri1' ]);
let setUserName  = faker.random.arrayElement([ 'userName1', 'userName2', 'userName3', 'userName4', 'userName5' ]);
let setAddress1  = faker.random.arrayElement([ 'address11', 'address12', 'address13', 'address14', 'address15' ]);
let setAddress2  = faker.random.arrayElement([ 'address21', 'address22', 'address23', 'address24', 'address25' ]);
let setPhone     = faker.random.arrayElement([ 'phone1', 'phone2', 'phone3', 'phone4', 'phone5' ]);
let setProductId = faker.random.arrayElement([ 'productId1', 'porductId2', 'productId3' ]);
let setReviewCnt = faker.random.arrayElement([ 'reviewCnt01', 'reviewCnt02', 'reviewCnt03' ]);
let setReviewRat = faker.random.arrayElement([ 'reviewRat01', 'reviewRat02', 'reviewRat03' ]);

let fakeUserPub  = faker.internet.password();
let fakeUserName = faker.name.lastName();
let fakeAddress1 = faker.address.streetName();
let fakeAddress2 = faker.address.streetAddress()
let fakePhone    = faker.phone.phoneNumber();

describe('kiki did API Success Test - Routes /api/v1/kiki', () => {
  let didID;
  let claimDoc;

  describe('create new document with address - POST /docclaim', () => {
    test('create with userPub, userName, address1, address2 and phone correctly', async () => {
      const reqData = { userPub: setUserPub, userName: setUserName, address1: setAddress1, address2: setAddress2, phone: setPhone };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/docclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      didID = res.body.result;
    });
  });

  describe('request document - POST /reqclaim', () => {
    test('request with userPri and didID correctly', async () => {
      const reqData = { userPri: setUserPri, didID: didID };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/reqclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      claimDoc = res.body.result;
    });
  });

  describe('publish document - POST /pubclaim', () => {
    test('publish with didID and claimDoc correctly', async () => {
      const reqData = { didID: didID, claimDoc: claimDoc };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/pubclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });
  });

  describe('create new document with review - POST /docclaim', () => {
    test('create with userPub, userName, productId, reviewCont and reviewRat correctly', async () => {
      const reqData = { userPub: setUserPub, userName: setUserName, productId: setProductId, reviewCont: setReviewCnt, reviewRat: setReviewRat };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/docclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      didID = res.body.result;
    });
  });

});

describe('kiki did API Exception Test - Routes /api/v1/kiki', () => {

  describe('create new document - POST /docclaim', () => {
    test('create with userName, address1, address2, phone and without userPub get errorcode', async () => {
      const reqData = { userName: setUserName, address1: setAddress1, address2: setAddress2, phone: setPhone };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/docclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(422);
      expect(res.body.success).to.be.false;
      expect(res.body.errorcode).to.equal('KDE0001');
    });
  });

  describe('create new document - POST /docclaim', () => {
    test('create with userName, address1 without phone get errorcode', async () => {
      const reqData = { userName: setUserName, address1: setAddress1, address2: setAddress2 };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/docclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(422);
      expect(res.body.success).to.be.false;
      expect(res.body.errorcode).to.equal('KDE0001');
    });
  });

  describe('create new document - POST /docclaim', () => {
    test('create with userName, productId without reviewCont get errorcode', async () => {
      const reqData = { userName: setUserName, productId: setProductId };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/docclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(422);
      expect(res.body.success).to.be.false;
      expect(res.body.errorcode).to.equal('KDE0001');
    });
  });

  describe('request document - POST /reqclaim', () => {
    test('request without userPri and didID correctly', async () => {
      const reqData = { };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/reqclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(422);
      expect(res.body.success).to.be.false;
      expect(res.body.errorcode).to.equal('KDE0001');
    });
  });

  describe('request document - POST /reqclaim', () => {
    test('request with userPri without didID correctly', async () => {
      const reqData = { userPri: setUserPri };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/reqclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(422);
      expect(res.body.success).to.be.false;
      expect(res.body.errorcode).to.equal('KDE0001');
    });
  });

  describe('publish document - POST /pubclaim', () => {
    test('publish with claimDoc without didID correctly', async () => {
      const reqData = { claimDoc: setReviewRat };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/pubclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).to.equal(422);
      expect(res.body.success).to.be.false;
      expect(res.body.errorcode).to.equal('KDE0001');
    });
  });

});
