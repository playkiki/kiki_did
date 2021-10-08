import crypto, { SHA256 } from 'crypto-js';
import * as secp from 'noble-secp256k1';

import { create } from "ipfs-http-client";
// import { DidDocument } from "./didDocument";
const DidDocument = require('./didDocument');
const CID = require('cids')
const multihashing = require('multihashing-async')

const secp256k1 = require('secp256k1');
const { randomBytes } = require('crypto');

const testIPFS = async () => {

  const ipfs = create('http://eventkiki.duckdns.org:5001', {timeout: 10000});

  // const { cid } = await client.add('hello world!');

  // console.log('cid : ', cid);

  // let doc = new DidDocument(ipfs, 'kiki');
  // let tmpCid = new CID('bafyreihzhejvfex57rwxeqgmuj4nhjwxixxwtoavn46e4ikocwbku3xixa');
  // let doc = await DidDocument.load(ipfs, tmpCid);
  // doc.addPublicKey('key1', 'RsaVerificationKey2018', 'publicKeyPem', '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n', 'did:3:someCid');
  // doc.addPublicKey('key2', 'Secp256k1VerificationKey2018', 'publicKeyHex', '02b97c30de767f084ce3080168ee293053ba33b235d7116a3263d29f1450936b71');
  // doc.removePublicKey('key1');

  // doc.addAuthentication('RsaSignatureAuthentication2018', 'key1');
  // doc.addAuthentication('Secp256k1SignatureAuthentication2018', 'key2');
  // doc.removeAuthentication('key1');

  // doc.addService('openid', 'OpenIdConnectVersion1.0Service', 'https://openid.example.com/');
  // doc.addService('inbox', 'SocialWebInboxService', 'https://social.example.com/83hfh37dj', { description: 'My public social inbox', spamCost: { amount: '0.50', currency: 'USD' } });
  // doc.removeService('inbox');

  // const method = {
  //   type            : 'ethereumPublishAndRevokeTo',
  //   contractAddress : '0x1b2d...'
  // };
  // doc.setRevocationMethod(method);

  // // console.log('doc : ', doc);

  // tmpCid = await doc.commit();
  // console.log('tmpCid : ', tmpCid);

  // let tmpValue = (await ipfs.dag.get(tmpCid)).value;
  // console.log('tmpValue : ', tmpValue);

  const userPub = '123456abcdef!@#$';
  const bytes = new TextEncoder('utf8').encode(userPub);
  const hash = await multihashing(bytes, 'sha2-256');
  let tmpCid = new CID(1, 'dag-pb', hash);
  let doc = new DidDocument(ipfs, 'kiki', tmpCid);

  // generate privKey
  const userPri = '123456abcdef!@#$-private';
  const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
  const hexPri = crypto.SHA256(userPri).toString(crypto.enc.Hex);
  const publicKey = secp.getPublicKey(hexPri);
  console.log('publicKey : ', publicKey);
  const hexPub = crypto.SHA256(publicKey).toString(crypto.enc.Hex);
  console.log('hexPub : ', hexPub);
  const signature = await secp.sign(messageHash, hexPri);
  console.log('signature : ', signature);
  const isSigned = secp.verify(signature, messageHash, publicKey);
  console.log('isSigned : ', isSigned);

  // const bytesPri = new TextEncoder('utf8').encode(userPri);
  // const hashPri = await multihashing(bytesPri, 'sha2-256');
  // let privKey;
  // do {
  //   privKey = SHA256(hashPri);
  // } while (!secp256k1.privateKeyVerify(privKey));
  
  // // get the public key in a compressed format
  // const pubKey = secp256k1.publicKeyCreate(privKey);
  
  // // sign the message
  // const sigObj = secp256k1.ecdsaSign(hashPri, privKey);
  
  // // verify the signature
  // console.log(secp256k1.ecdsaVerify(sigObj.signature, msg, pubKey));
  // // => true

  doc.addPublicKey('key-1', 'Secp256k1VerificationKey2018', 'publicKeyHex', hexPub);
  doc.addAuthentication('Secp256k1SignatureAuthentication2018', 'key-1');

  tmpCid = await doc.commit();

  // let tmpV = doc.DID.split(':')[2];
  // console.log('tmpV : ', tmpV);
  // tmpCid = new CID(tmpV);
  // console.log('tmpCid : ', tmpCid);
  // doc = await DidDocument.load(ipfs, tmpCid);

  doc = await DidDocument.load(ipfs, tmpCid);

  // console.log('doc : ', doc);
  console.log('doc.DID : ', doc.DID);
  
  let tmpValue = (await ipfs.dag.get(tmpCid)).value;
  console.log('tmpValue : ', tmpValue);

  console.log('tmpCid : ', tmpCid);

}

testIPFS();