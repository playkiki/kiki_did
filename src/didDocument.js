const DID_PLACEHOLDER = 'GENESIS'

/**
 * A class for creating ipfs based DID Documents.
 * Based on the DID spec: https://w3c-ccg.github.io/did-spec/
 */
class DidDocument {
  /**
   * Create a new DID Document.
   *
   * @param     {Object}        ipfs            An js-ipfs instance
   * @param     {String}        method          The name of the DID Method
   * @return    {DidDocument}                   self
   */
  constructor (ipfs, method) {
    this._ipfs = ipfs
    this._content = {
      id : `did:${method}:${DID_PLACEHOLDER}`
    }
  }

  get DID () {
    if (this._content.id.includes(DID_PLACEHOLDER)) {
      throw new Error('DID is not available before commit')
    }
    return this._content.id
  }

  /**
   * Load an already existing DID Document.
   *
   * @param     {Object}        ipfs            An js-ipfs instance
   * @param     {String}        documentCid     The CID of the document
   * @return    {Promise<DidDocument>}                   self
   */
  static async load (ipfs, documentCid) {
    const doc = new DidDocument(ipfs)
    doc._content = await DidDocument.cidToDocument(ipfs, documentCid)
    doc._content.previousDocument = { '/': documentCid.toString() }
    return doc
  }

  /**
   * Add a new public key
   *
   * @param     {String}        id              The id of the key, e.g. "key1"
   * @param     {String}        type            The type of the key
   * @param     {String}        encoding        The encoding of the key
   * @param     {String}        key             The encoded public key
   * @param     {String}        owner           The owner of the key (optional)
   */
  addPublicKey (id, type, encoding, key, owner) {
    if (!this._content.publicKey) {
      this._content.publicKey = []
    }
    let entry = {
      id : `${this._content.id}#${id}`,
      type
    }
    entry[encoding] = key
    if (owner) {
      entry.owner = owner
    }
    this._content.publicKey.push(entry)
  }

  /**
   * Remove a public key
   *
   * @param     {String}        id              The id of the key, e.g. "key1"
   */
  removePublicKey (id) {
    const idx = this._content.publicKey.findIndex(e => e.id.endsWith(id))
    this._content.publicKey.splice(idx, 1)
    if (!this._content.publicKey.length) {
      delete this._content.publicKey
    }
  }

  /**
   * Add a new authentication
   *
   * @param     {String}        type            The type of the authentication
   * @param     {String}        id              The id of the key to be used, e.g. "key1"
   */
  addAuthentication (type, id) {
    if (!this._content.authentication) {
      this._content.authentication = []
    }
    this._content.authentication.push({
      type,
      publicKey : `${this._content.id}#${id}`
    })
  }

  /**
   * Remove an authentication
   *
   * @param     {String}        id              The id of the key, e.g. "key1"
   */
  removeAuthentication (id) {
    const idx = this._content.authentication.findIndex(e => e.publicKey.endsWith(id))
    this._content.authentication.splice(idx, 1)
    if (!this._content.authentication.length) {
      delete this._content.authentication
    }
  }

  /**
   * Add a new service
   *
   * @param     {String}        id                  The id of the key to be used, e.g. "key1"
   * @param     {String}        type                The type of the service
   * @param     {String}        serviceEndpoint     The endpoint of the service
   * @param     {Object}        additionalFields    Any additional fields (optional)
   */
  addService (id, type, serviceEndpoint, additionalFields) {
    if (!this._content.service) {
      this._content.service = []
    }
    this._content.service.push(Object.assign({
      id : `${this._content.id};${id}`,
      type,
      serviceEndpoint
    }, additionalFields))
  }

  /**
   * Remove a service
   *
   * @param     {String}        id              The id of the key, e.g. "key1"
   */
  removeService (id) {
    const idx = this._content.service.findIndex(e => e.id.endsWith(id))
    this._content.service.splice(idx, 1)
    if (!this._content.service.length) {
      delete this._content.service
    }
  }

  /**
   * Set the revocationMethod. This can be of any js object
   * and is determined by the implementer of a revocation module.
   *
   * @param     {Object}        methodDescriptor    the object that defines the revocation method
   */
  setRevocationMethod (methodDescriptor) {
    this._content.revocationMethod = methodDescriptor
  }

  /**
   * Add a new property
   *
   * @param     {String}        propName            The name of the property
   * @param     {Object}        propValue           The value of the property
   */
  addCustomProperty (propName, propValue) {
    this._content[propName] = propValue
  }

  /**
   * Remove a property
   *
   * @param     {String}        propName            The name of the property
   */
  removeCustomProperty (propName) {
    delete this._content[propName]
  }

  /**
   * Commit all changes and create a new ipfs dag object.
   *
   * @param     {Object}        opts                Optional parameters
   * @param     {Boolean}       noTimestamp         Don't use timestamps if true
   *
   * @return    {Promise<CID>}                   The CID of the object
   */
  async commit (opts = {}) {
    if (!this._content.created) {
      this._content['@context'] = 'https://w3id.org/did/v1'
      if (!opts.noTimestamp) {
        this._content.created = (new Date(Date.now())).toISOString()
      }
    } else if (!opts.noTimestamp) {
      this._content.updated = (new Date(Date.now())).toISOString()
    }
    const cid = await this._ipfs.dag.put(this._content, { format: 'dag-cbor', hashAlg: 'sha2-256' })
    // set up for further changes:
    this._content = await DidDocument.cidToDocument(this._ipfs, cid)
    this._content.previousDocument = { '/': cid.toString() }
    return cid
  }

  /**
   * Returns the DID document of a document CID
   *
   * @param     {Object}        ipfs            An js-ipfs instance
   * @param     {String}        documentCid     The CID of the document
   * @return    {Promise<Object>}                        The DID document as a js object
   */
  static async cidToDocument (ipfs, documentCid) {
    let doc = (await ipfs.dag.get(documentCid)).value
    // If genesis document replace placeholder identifier with cid
    if (doc.id.includes(DID_PLACEHOLDER)) {
      const re = new RegExp(DID_PLACEHOLDER, 'gi')
      doc.id = doc.id.replace(re, documentCid)
      if (doc.publicKey) {
        doc.publicKey = JSON.parse(JSON.stringify(doc.publicKey).replace(re, documentCid))
      }
      if (doc.authentication) {
        doc.authentication = JSON.parse(JSON.stringify(doc.authentication).replace(re, documentCid))
      }
      if (doc.service) {
        doc.service = JSON.parse(JSON.stringify(doc.service).replace(re, documentCid))
      }
    }
    if (doc.previousDocument) {
      // make CID human readable
      doc.previousDocument = { '/': doc.previousDocument.toString() }
    }
    return doc
  }
}

module.exports = DidDocument