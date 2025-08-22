const makeQr = require("./src/makeQr");
const makeFile = require("./src/makeFile");
const makeString = require("./src/makeString");
const { dataQris, toCRC16, pad } = require("./lib");

module.exports = {
  makeQr,
  makeFile,
  makeString,
  dataQris,
  toCRC16,
  pad,
};
