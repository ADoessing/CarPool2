module.exports.random = (callback) => {
  let number = Math.floor(Math.random(1001));
  this._seed = number % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;

  return this._seed = this._seed * 16807 % 2147483647;
}
