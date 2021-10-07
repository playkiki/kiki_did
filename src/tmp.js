import { create } from "ipfs-http-client";
// import { DidDocument } from "./didDocument";
const DidDocument = require('./didDocument')

const testIPFS = async () => {

  const client = create('http://eventkiki.duckdns.org:5001');

  // const { cid } = await client.add('hello world!');

  // console.log('cid : ', cid);

  let doc = new DidDocument(client, 'kiki')
  doc.addPublicKey('key1', 'RsaVerificationKey2018', 'publicKeyPem', '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n', 'did:3:someCid')
  doc.addPublicKey('key2', 'Secp256k1VerificationKey2018', 'publicKeyHex', '02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71')
  doc.removePublicKey('key1')

  doc.addAuthentication('RsaSignatureAuthentication2018', 'key1')
  doc.addAuthentication('Secp256k1SignatureAuthentication2018', 'key2')
  doc.removeAuthentication('key1')

  doc.addService('openid', 'OpenIdConnectVersion1.0Service', 'https://openid.example.com/')
  doc.addService('inbox', 'SocialWebInboxService', 'https://social.example.com/83hfh37dj', { description: 'My public social inbox', spamCost: { amount: '0.50', currency: 'USD' } })
  doc.removeService('inbox')

  const method = {
    type            : 'ethereumPublishAndRevokeTo',
    contractAddress : '0x1b2d...'
  }
  doc.setRevocationMethod(method)

  console.log('doc : ', doc);

  const tmpCid = await doc.commit()
  console.log('tmpCid : ', tmpCid);

  let tmpValue = (await client.dag.get(tmpCid)).value;
  console.log('tmpValue : ', tmpValue);

}

testIPFS();