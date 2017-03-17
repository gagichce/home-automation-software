'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('patterns service', function() {
  it('registered the patterns service', () => {
    assert.ok(app.service('patterns'));
  });
});
