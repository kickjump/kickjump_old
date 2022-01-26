import BN from 'bn.js';

if (!BN.prototype.toBuffer && Buffer) {
  BN.prototype.toBuffer = function toBuffer(endian, length) {
    return this.toArrayLike(Buffer, endian, length);
  };
}
