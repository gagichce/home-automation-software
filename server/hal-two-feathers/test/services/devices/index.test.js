'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('devices service', function() {
  it('registered the devices service', () => {
    assert.ok(app.service('devices'));
  });
});
