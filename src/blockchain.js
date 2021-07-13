var createHash = require('crypto');
const url = require('url');

class Block {
  constructor(index, timestamp, transactions, proof, previous_hash) {
    this._index = index;
    this._timestamp = timestamp;
    this._transactions = transactions;
    this._proof = proof;
    this._previous_hash = previous_hash; 
  }

  get timestamp() {
    return this._timestamp;
  }

  get transactions() {
    return this._transactions;
  }

  get proof() {
    return this._proof;
  }

  get previous_hash() {
    return this._previous_hash;
  }

  get index() {
    return this._index;
  }
    
}

class Blockchain {
  constructor() {
    this._chain = [];
    this._nodes = new Set();
    this._current_transactions = [];
    //Add genesis block
    this.new_block(100, 1);
    console.log(JSON.stringify(this.chain));
  }

  get chain() {
    return this._chain;
  }

  get nodes() {
    return this._nodes;
  }

  set current_transactions(transactions) {
    this._current_transactions = transactions;
  }

  get current_transactions() {
    return this._current_transactions
  }

  register_node(address) {
    var parsed_url = new URL(address); // URL documentation can be found at https://nodejs.org/api/url.html#url_the_whatwg_url_api
    this._nodes.add(parsed_url);
  }

  valid_chain(chain_to_check) {
    var current_index = 1;
    var last_block = chain_to_check[0];
    while (current_index < chain_to_check.length) {
      var block = chain_to_check[current_index];
      if (block.previous_hash != this.hash(block)) {
        return false;
      }
      if (! this.valid_proof(last_block.proof, block.proof)) {
        return false;
      }
      last_block = block;
      current_index +=1;
    }
    return true;
  }

  resolve_conflicts() {
    var neighbors = this.nodes;
    var that = this;
    var new_chain = null;
    var flag = 0;
    var tmp_length = 0;
    var max_length = this.chain.length;
    neighbors.forEach(node => {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          var new_chain = JSON.parse(xmlHttp.responseText);
          if (that.valid_chain(new_chain) && new_chain.length > max_length) {
            that._chain = new_chain;
            max_length = new_chain.length;
          }
        }
      };
      xmlHttp.open("GET", node.origin + "/chain", true); // true for asynchronous 
      xmlHttp.send(null);
    });
  }

  new_block(proof, previous_hash = null) {
    var that = this;
    var previous_index;

    /**
      - Important Notice regarding block creation:
      It is important to always use the constructor when creating blocks to ensure consistent hashes.
      If we create the block in a different way, then javascript orders the variables in it in different order
      This creates inconsistent hashes when Object is stringified and hashed since order is altered 
    */

    let time = new Date();
    if (this.chain.length == 0) {
      previous_index = 0;
    } else{
      previous_index = this.chain.length - 1;
    }
    let block = new Block(that.chain.length+1, time, that.current_transactions, previous_hash || this.hash(this.chain[previous_index]));
    console.log(block);
    //Reset the current list of transactions
    this.setCurrent_transactions = [];
    this.chain.push(block);
    return block;
  }

  last_block() {
    if (this.chain.length == 0) {
      return 0;
    }
    return this.chain[this.chain.length - 1];
  }

  proof_of_work(last_proof) {
    var proof = 0;
    while(!this.valid_proof(last_proof, proof)) {
      proof+=1;
    }
    console.log("Proof number found " + proof);
    return proof;
  }

  valid_proof(last_proof, proof) {
    let guess = Buffer.from(proof.toString()).toString('base64') + Buffer.from(last_proof.toString()).toString('base64');
    var hash = createHash.createHash('sha256')
      .update(guess)
      .digest('base64');
    return hash.startsWith('0000');
  }

  hash(block) {
    let block_string = JSON.stringify(block);
    console.log("block " + block_string);
    let base64_string = Buffer.from(block_string.toString()).toString("base64");
    var hash = createHash.createHash('sha256')
      .update(base64_string)
      .digest('base64'); 
    console.log("Creating Hash " + hash);
    return hash;
  }

  new_transaction(context, id, authentication, service) {
    this.current_transactions.push(
      {
        'context'        : context,
        'id'             : id,
        'authentication' : authentication,
        'service'        : service
      });
    //return the index of the next block to be mined. 
    if (this.chain.length == 0) {
      return 1;
    } else {
      return this.chain[this.chain.length -1].index +1;
    }

    console.log (this.current_transactions);
            
  }
}

var blockchain = new Blockchain();
module.exports = blockchain;