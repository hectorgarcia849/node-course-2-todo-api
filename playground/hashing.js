// const {SHA256} = require('crypto-js');
//
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message ${message}`);
// console.log(`Hash ${hash}`);
//
// var data = {
//     id: 4
// };
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data).toString());
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//     console.log('Data was not changed')
// } else {
//     console.log("Data was changed, don't trust");
// }
//

// const jwt = require('jsonwebtoken');
//
// jwt.sign
// jwt.verify
//
// var data = {
//     id: 10
// }
// //token produced is made up of : header.paylod.signature (salt secret)
//
// var token = jwt.sign(data, '123abc'); //second parameter is the salt, sign method generates token
// console.log(token);
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

const bcrypt = require('bcryptjs');
var password = '123abc!'

// bcrypt.genSalt(10, (err, salt) => { //10 sec per hashing
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$9l6JmW84EZXFgS2vZXYyqOp7yDRl2I1s0G.YWv.lWrMxfsGkOvU3.'

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});