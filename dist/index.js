'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promiseFor = promiseFor;
exports.isDev = isDev;
exports.isProd = isProd;
exports.isTest = isTest;
exports.normalizeObject = normalizeObject;
exports.flattenObject = flattenObject;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @todo
 */
function promiseFor(condition, action, value) {
  if (condition(value)) {
    return _bluebird2.default.resolve(value);
  }

  return action(value).then(promiseFor.bind(null, condition, action));
}

/**
 * @todo
 */
function isDev() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

/**
 * @todo
 */
function isProd() {
  return process.env.NODE_ENV === 'production';
}

/**
 * @todo
 */
function isTest() {
  return process.env.NODE_ENV === 'testing';
}

/**
 * Normalize an object recursively
 *
 * Alphabetize an object by key, sort inner arrays, etc.
 * @todo
 *
 * Note that we use `clone` to avoid altering the old object in-place, this
 * makes for weird bugs that would be really tough to track down.
 *
 * @todo
 * @return {object} - A normalized object
 */
function normalizeObject(obj) {
  if (!(0, _lodash.isObject)(obj)) {
    return obj;
  }

  let normalized = {};

  Object.keys(obj).sort().forEach(key => {
    let val = (0, _lodash.clone)(obj[key]);

    if (Array.isArray(val)) {
      val = val.sort();
    } else {
      val = normalizeObject(val);
    }

    normalized[key] = val;
  });

  return normalized;
}

/**
 * Recursively flatten an object into key/value pairs
 *
 * @param {Object} obj The object to be flattened.
 * @param {string} [separator=.] The string to insert between merged keys.
 * @param {string} [prefix=''] An optional prefix to prepend to top-level keys.
 * @param {number} [depth=-1] The max hierarchical depth to merge into the top-level.
 * @param {number} [first=true] True if at the top-level (do not use this param)
 * @return {Object} The flattened object.
 */
function flattenObject(obj) {
  let separator = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];
  let prefix = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
  let depth = arguments.length <= 3 || arguments[3] === undefined ? -1 : arguments[3];
  let first = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

  if (!(0, _lodash.isObject)(obj)) {
    return obj;
  }

  let flattened = {};

  (0, _lodash.forOwn)(obj, (v, k) => {
    let key = !first && prefix ? [prefix, k].join(separator) : k;

    if ((0, _lodash.isObject)(v) && !(0, _lodash.isArray)(v) && (depth > 0 || depth < 0)) {
      (0, _lodash.merge)(flattened, flattenObject(v, separator, key, depth - 1, false));
    } else {
      flattened[key] = v;
    }
  });

  return first ? (0, _lodash.mapKeys)(flattened, (v, k) => prefix + k) : flattened;
}