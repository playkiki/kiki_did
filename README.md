# Decentralized Identity
Decentralized Identity is an emerging concept that gives back control of identity to consumers through the use of an identity wallet in which they collect verified information about themselves from certified issuers (such as the Government)

![did_concept](https://user-images.githubusercontent.com/33611925/125380481-344a0880-e3cd-11eb-89cf-0854c91d0954.png)

## How to service

![how_to_service](https://user-images.githubusercontent.com/33611925/125380711-97d43600-e3cd-11eb-8247-a27a61f1afe0.png)

## Service sequence

![service_sequence](https://user-images.githubusercontent.com/33611925/125381069-3e203b80-e3ce-11eb-8c2c-368229e62d9f.png)

## W3C standards
- [Decentralized Identifiers] https://www.w3.org/TR/did-core/

## License 

see license https://github.com/playkiki/kiki_did/blob/main/LICENSE

## How to participate
Register github issue at https://github.com/playkiki/kiki_did/issues/new/choose

## Contributing guidelines

### - _Formatting_

### 2 spaces for indentation

Use 2 spaces for indenting your code and swear an oath to never mix tabs and spaces

### Use semicolons

According to [scientific research](https://news.ycombinator.com/item?id=1547647), the usage of semicolons is a core value of our community. Consider the points of [the opposition](https://blog.izs.me/2010/12/an-open-letter-to-javascript-leaders-regarding/), but be a traditionalist when it comes to abusing error correction mechanisms for cheap syntactic pleasures.

### 80 characters per line

Limit your lines to 80 characters. Yes, screens have gotten much bigger over the last few years, but your brain has not. Use the additional room for split screen, your editor supports that, right?

### Use single quotes

Use single quotes, unless you are writing JSON. This helps you separate your objects’ strings from normal strings.

Right:
```
var foo = ‘bar’;
```

Wrong:
```
var foo = “bar”;
```

### Opening braces go on the same line

Your opening braces go on the same line as the statement.

Right:
```
if (true) {
  console.log(‘winning’);
}
```

Wrong:
```
if (true)
{
  console.log(‘losing’);
}
```

Also, notice the use of white space before and after the condition statement. What if you want to write ‘else’ or ‘else if’ along with your ‘if’…

Right:
```
if (true) {
  console.log(‘winning’);
} else if (false) {
  console.log(‘this is good’);
} else {
  console.log(‘finally’);
}
```

Wrong:
```
if (true)
{
  console.log(‘losing’);
}
else if (false)
{
  console.log(‘this is bad’);
}
else
{
  console.log(‘not good’);
}
```

### Declare one variable per var statement

Declare one variable per var statement, it makes it easier to re-order the lines.

Right:
```
var keys = [‘foo’, ‘bar’];
var values = [23, 42];
var object = {};
```

Wrong:
```
var keys = [‘foo’, ‘bar’],
values = [23, 42],
object = {},
key;
```

### - _Naming Conventions_

### Use [lowerCamelCase](http://wiki.c2.com/?LowerCamelCase) for variables, properties and function names

Variables, properties and function names should use lowerCamelCase. They should also be descriptive. Single character variables and uncommon abbreviations should generally be avoided.

Right:
```
var adminUser = db.query(‘SELECT * FROM users …’);
```

Wrong:
```
var admin_user = db.query(‘SELECT * FROM users …’);
```

### Use [UpperCamelCase](http://wiki.c2.com/?UpperCamelCase) for class names

Class names should be capitalised using UpperCamelCase.

Right:
```
function BankAccount() {
}
```

Wrong:
```
function bank_Account() {
}
```

### Use UPPERCASE for Constants

Constants should be declared as regular variables or static class properties, using all uppercase letters.

Right:
```
var SECOND = 1 * 1000;
function File() {
}
File.FULL_PERMISSIONS = 0777;
```

Wrong:
```
const SECOND = 1 * 1000;
function File() {
}
File.fullPermissions = 0777;
```

## Howto setup and run

Required nodejs v14.0.0 or above because of ipfs-http-client library.

Check your node version and download project.
```
$ node -v

$ git clone https://github.com/playkiki/kiki_did
```

### IPFS setting

This project does not focus on IPFS.

Please refer to the following URL how to setup IPFS.

https://labs.eleks.com/2019/03/ipfs-network-data-replication.html

We assume that you already have the private IPFS system on your own.

You can use docker image to build your own privte IPFS easily.

https://hub.docker.com/r/ipfs/go-ipfs/

Sample code for docker-compose.xml
```
  ipfs-node:
    container_name: ipfs-node
    image: ipfs/go-ipfs
    environment:
      - PUID=1002
      - PGID=1002
      - TZ=Asia/Seoul
    volumes:
      - /home/docker/ipfs-node:/data/ipfs
      - /home/docker/ipfs-staging:/staging
    ports:
      - 4001:4001
      - 5001:5001
      - 8080:8080
    restart: unless-stopped
```

### DB setting

We are using MySQL database as storage for personal documents.

Please follow to the next steps.
1. Copy sample file src/config/.env.example to src/config/.env
1. Change template environment variables to yours

### Runing the server

First install modules.
```
$ npm install
```
We need yarn to run test and run server.
```
$ npm install -g yarn
```
Then build and start server.
```
$ yarn build

$ yarn serve
```

### Testing

Run the test command.
```
$ yarn test
```

