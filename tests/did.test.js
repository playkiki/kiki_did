// kiki/did API TEST Suites

const faker = require('faker/locale/en');
let set_userPub   = faker.random.arrayElement([ 'userPub1', 'userPub2', 'userPub3', 'userPub4', 'userPub5' ]);
let set_userPri   = faker.random.arrayElement([ 'userPri1', 'userPri2', 'userPri3', 'userPri4', 'userPri5' ]);
let set_userName  = faker.random.arrayElement([ 'userName1', 'userName2', 'userName3', 'userName4', 'userName5' ]);
let set_address1  = faker.random.arrayElement([ 'address11', 'address12', 'address13', 'address14', 'address15' ]);
let set_address2  = faker.random.arrayElement([ 'address21', 'address22', 'address23', 'address24', 'address25' ]);
let set_phone     = faker.random.arrayElement([ 'phone1', 'phone2', 'phone3', 'phone4', 'phone5' ]);

let fake_userPub  = faker.internet.password();
let fake_userName = faker.name.lastName();
let fake_address1 = faker.address.streetName();
let fake_address2 = faker.address.streetAddress()
let fake_phone    = faker.phone.phoneNumber();

describe('kiki did API Test - Routes /api/v1/kiki', () => {
  let didID;
  let claimDoc;

  describe('create new document - POST /docclaim', () => {
    test('create with userPub, userName, address1, address2 and phone correctly', async () => {
      const reqData = { userPub: set_userPub, userName: set_userName, address1: set_address1, address2: set_address2, phone: set_phone };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/docclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).toEqual(201);
      expect(res.body.success).toBe(true);
      didID = res.body.result;
    });
  });

  describe('request document - POST /reqclaim', () => {
    test('request with userPri and didID correctly', async () => {
      const reqData = { userPri: set_userPri, didID: didID };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/reqclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).toEqual(200);
      expect(res.body.success).toBe(true);
      claimDoc = res.body.result;
    });
  });

  describe('publish document - POST /pubclaim', () => {
    test('publish with didID and claimDoc correctly', async () => {
      const reqData = { didID: didID, claimDoc: claimDoc };
      const res = await global.agent.post(encodeURI(`/api/v1/kiki/pubclaim`)).send(reqData);
      console.info('res.body : ', res.body);
      expect(res.status).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });
});
