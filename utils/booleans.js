function parseBoolean(boolean) {
  boolean = typeof (boolean) === 'string' ? boolean.toLowerCase() : boolean
  let myBoolean = {
    "true": true,
    "1": true,
    "false": false,
    "0": false
  }
  return myBoolean[boolean] || false
}

module.exports = {
  parseBoolean
}