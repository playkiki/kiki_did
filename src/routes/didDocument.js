const DID_PLACEHOLDER = 'KIKI-GENESIS';

/**
 * A class for creating ipfs based DID Documents.
 * Based on the DID spec: https://w3c-ccg.github.io/did-spec/
 */
class DidDocument {
  /**
   * Create a new DID Document.
   */
  constructor (ipfs, method, cid) {
    this._ipfs = ipfs;
    this._content = {
      id : `did:${method}:${cid || DID_PLACEHOLDER}`
    };
  }

  get DID () {
    if (this._content.id.includes(DID_PLACEHOLDER)) {
      throw new Error('DID is not available before commit');
    }
    return this._content.id;
  }

  /**
   * Load an already existing DID Document.
   */
  static async load (ipfs, documentCid) {
    const doc = new DidDocument(ipfs);
    doc._content = await DidDocument.cidToDocument(ipfs, documentCid);
    doc._content.previousDocument = { '/': documentCid.toString() };
    return doc;
  }

  /**
   * Add a new public key
   */
  addPublicKey (id, type, encoding, key, owner) {
    if (!this._content.publicKey) {
      this._content.publicKey = [];
    }
    let entry = {
      id : `${this._content.id}#${id}`,
      type
    };
    entry[encoding] = key;
    if (owner) {
      entry.owner = owner;
    }
    this._content.publicKey.push(entry);
  }

  /**
   * Remove a public key
   */
  removePublicKey (id) {
    const idx = this._content.publicKey.findIndex(e => e.id.endsWith(id));
    this._content.publicKey.splice(idx, 1);
    if (!this._content.publicKey.length) {
      delete this._content.publicKey;
    }
  }

  /**
   * Add a new authentication
   */
  addAuthentication (type, id) {
    if (!this._content.authentication) {
      this._content.authentication = [];
    }
    this._content.authentication.push({
      type,
      publicKey : `${this._content.id}#${id}`
    });
  }

  /**
   * Remove an authentication
   */
  removeAuthentication (id) {
    const idx = this._content.authentication.findIndex(e => e.publicKey.endsWith(id));
    this._content.authentication.splice(idx, 1);
    if (!this._content.authentication.length) {
      delete this._content.authentication;
    }
  }

  /**
   * Add a new service
   */
  addService (id, type, serviceEndpoint, additionalFields) {
    if (!this._content.service) {
      this._content.service = [];
    }
    this._content.service.push(Object.assign({
      id : `${this._content.id};${id}`,
      type,
      serviceEndpoint
    }, additionalFields));
  }

  /**
   * Remove a service
   */
  removeService (id) {
    const idx = this._content.service.findIndex(e => e.id.endsWith(id));
    this._content.service.splice(idx, 1);
    if (!this._content.service.length) {
      delete this._content.service;
    }
  }

  /**
   * Set the revocationMethod. This can be of any js object
   * and is determined by the implementer of a revocation module.
   */
  setRevocationMethod (methodDescriptor) {
    this._content.revocationMethod = methodDescriptor;
  }

  /**
   * Add a new property
   */
  addCustomProperty (propName, propValue) {
    this._content[propName] = propValue;
  }

  /**
   * Remove a property
   */
  removeCustomProperty (propName) {
    delete this._content[propName];
  }

  /**
   * Commit all changes and create a new ipfs dag object.
   */
  async commit (opts = {}) {
    if (!this._content.created) {
      this._content['@context'] = 'https://w3id.org/did/v1';
      if (!opts.noTimestamp) {
        this._content.created = (new Date(Date.now())).toISOString();
      }
    } else if (!opts.noTimestamp) {
      this._content.updated = (new Date(Date.now())).toISOString();
    }
    const cid = await this._ipfs.dag.put(this._content, { format: 'dag-cbor', hashAlg: 'sha2-256' });
    // set up for further changes:
    this._content = await DidDocument.cidToDocument(this._ipfs, cid);
    this._content.previousDocument = { '/': cid.toString() };
    return cid;
  }

  /**
   * Returns the DID document of a document CID
   */
  static async cidToDocument (ipfs, documentCid) {
    let doc = (await ipfs.dag.get(documentCid, { path: '/' })).value;
    // If genesis document replace placeholder identifier with cid
    if (doc.id.includes(DID_PLACEHOLDER)) {
      const re = new RegExp(DID_PLACEHOLDER, 'gi');
      doc.id = doc.id.replace(re, documentCid);
      if (doc.publicKey) {
        doc.publicKey = JSON.parse(JSON.stringify(doc.publicKey).replace(re, documentCid));
      }
      if (doc.authentication) {
        doc.authentication = JSON.parse(JSON.stringify(doc.authentication).replace(re, documentCid));
      }
      if (doc.service) {
        doc.service = JSON.parse(JSON.stringify(doc.service).replace(re, documentCid));
      }
    }
    if (doc.previousDocument) {
      // make CID human readable
      doc.previousDocument = { '/': doc.previousDocument.toString() };
    }
    return doc;
  }
}

module.exports = DidDocument;