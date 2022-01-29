var test = require('ava');
var traverse = require('..');
var isEqual = require('lodash/isEqual');

test('mutate', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse(obj).forEach(function (x) {
        if (typeof x === 'number' && x % 2 === 0) {
            this.update(x * 10);
        }
    });
    t.deepEqual(obj, res);
    t.deepEqual(obj, { a : 1, b : 20, c : [ 3, 40 ] });
});

test('mutateT', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse.forEach(obj, function (x) {
        if (typeof x === 'number' && x % 2 === 0) {
            this.update(x * 10);
        }
    });
    t.deepEqual(obj, res);
    t.deepEqual(obj, { a : 1, b : 20, c : [ 3, 40 ] });
});

test('map', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse(obj).map(function (x) {
        if (typeof x === 'number' && x % 2 === 0) {
            this.update(x * 10);
        }
    });
    t.deepEqual(obj, { a : 1, b : 2, c : [ 3, 4 ] });
    t.deepEqual(res, { a : 1, b : 20, c : [ 3, 40 ] });
});

test('mapT', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse.map(obj, function (x) {
        if (typeof x === 'number' && x % 2 === 0) {
            this.update(x * 10);
        }
    });
    t.deepEqual(obj, { a : 1, b : 2, c : [ 3, 4 ] });
    t.deepEqual(res, { a : 1, b : 20, c : [ 3, 40 ] });
});

test('clone', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse(obj).clone();
    t.deepEqual(obj, res);
    t.assert(obj !== res);
    obj.a ++;
    t.deepEqual(res.a, 1);
    obj.c.push(5);
    t.deepEqual(res.c, [ 3, 4 ]);
});

test('cloneT', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse.clone(obj);
    t.deepEqual(obj, res);
    t.assert(obj !== res);
    obj.a ++;
    t.deepEqual(res.a, 1);
    obj.c.push(5);
    t.deepEqual(res.c, [ 3, 4 ]);
});

test('reduce', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse(obj).reduce(function (acc, x) {
        if (this.isLeaf) acc.push(x);
        return acc;
    }, []);
    t.deepEqual(obj, { a : 1, b : 2, c : [ 3, 4 ] });
    t.deepEqual(res, [ 1, 2, 3, 4 ]);
});

test('reduceInit', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse(obj).reduce(function (acc, x) {
        if (this.isRoot) assert.fail('got root');
        return acc;
    });
    t.deepEqual(obj, { a : 1, b : 2, c : [ 3, 4 ] });
    t.deepEqual(res, obj);
});

test('remove', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    traverse(obj).forEach(function (x) {
        if (this.isLeaf && x % 2 == 0) this.remove();
    });

    t.deepEqual(obj, { a : 1, c : [ 3 ] });
});

exports.removeNoStop = function() {
    var obj = { a : 1, b : 2, c : { d: 3, e: 4 }, f: 5 };

    var keys = [];
    traverse(obj).forEach(function (x) {
        keys.push(this.key)
        if (this.key == 'c') this.remove();
    });

    t.deepEqual(keys, [undefined, 'a', 'b', 'c', 'd', 'e', 'f'])
}

exports.removeStop = function() {
    var obj = { a : 1, b : 2, c : { d: 3, e: 4 }, f: 5 };

    var keys = [];
    traverse(obj).forEach(function (x) {
        keys.push(this.key)
        if (this.key == 'c') this.remove(true);
    });

    t.deepEqual(keys, [undefined, 'a', 'b', 'c', 'f'])
}

test('removeMap', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse(obj).map(function (x) {
        if (this.isLeaf && x % 2 == 0) this.remove();
    });

    t.deepEqual(obj, { a : 1, b : 2, c : [ 3, 4 ] });
    t.deepEqual(res, { a : 1, c : [ 3 ] });
});

test('remove proto', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    traverse(obj).remove("c[1]");

    t.assert(isEqual(
        obj, { a : 1, b : 2, c : [ 3 ] }
    ));

    t.assert(!isEqual(
        obj, { a : 1, b : 2, c : [ 3, undefined ] }
    ));

    t.assert(!isEqual(
        obj, { a : 1, b : 2, c : [ 3, null ] }
    ));

    var obj = { a : 1, b : 2, b : 2, c : [ 3, 4 ] };
    traverse(obj).remove("a");

    t.assert(isEqual(
        obj, { b : 2, c : [ 3, 4 ] }
    ));
});

test('delete proto', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    traverse(obj).delete("c[1]");

    t.assert(isEqual(
        obj, { a : 1, b : 2, c : [ 3, undefined ] }
    ));

    t.assert(!isEqual(
        obj, { a : 1, b : 2, c : [ 3 ] }
    ));

    t.assert(!isEqual(
        obj, { a : 1, b : 2, c : [ 3, null ] }
    ));

    var obj = { a : 1, b : 2, b : 2, c : [ 3, 4 ] };
    traverse(obj).delete("a");

    t.assert(isEqual(
        obj, { b : 2, c : [ 3, 4 ] }
    ));
});

test('delete', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    traverse(obj).forEach(function (x) {
        if (this.isLeaf && x % 2 == 0) this.delete();
    });

    t.assert(isEqual(
        obj, { a : 1, c : [ 3, undefined ] }
    ));

    t.assert(!isEqual(
        obj, { a : 1, c : [ 3 ] }
    ));

    t.assert(!isEqual(
        obj, { a : 1, c : [ 3, null ] }
    ));
});

test('deleteNoStop', function (t) {
    var obj = { a : 1, b : 2, c : { d: 3, e: 4 } };

    var keys = [];
    traverse(obj).forEach(function (x) {
        keys.push(this.key)
        if (this.key == 'c') this.delete();
    });

    t.deepEqual(keys, [undefined, 'a', 'b', 'c', 'd', 'e'])
});

test('deleteStop', function (t) {
    var obj = { a : 1, b : 2, c : { d: 3, e: 4 } };

    var keys = [];
    traverse(obj).forEach(function (x) {
        keys.push(this.key)
        if (this.key == 'c') this.delete(true);
    });

    t.deepEqual(keys, [undefined, 'a', 'b', 'c'])
});

test('deleteRedux', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4, 5 ] };
    traverse(obj).forEach(function (x) {
        if (this.isLeaf && x % 2 == 0) this.delete();
    });

    t.assert(isEqual(
        obj, { a : 1, c : [ 3, undefined, 5 ] }
    ));

    t.assert(isEqual(
        obj, { a : 1, c : [ 3 ,, 5 ] }
    ));

    t.assert(!isEqual(
        obj, { a : 1, c : [ 3, null, 5 ] }
    ));

    t.assert(!isEqual(
        obj, { a : 1, c : [ 3, 5 ] }
    ));
});

test('deleteMap', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse(obj).map(function (x) {
        if (this.isLeaf && x % 2 == 0) this.delete();
    });

    t.assert(isEqual(
        obj,
        { a : 1, b : 2, c : [ 3, 4 ] }
    ));

    var xs = [ 3, 4 ];
    delete xs[1];

    t.assert(isEqual(
        res, { a : 1, c : xs }
    ));

    t.assert(isEqual(
        res, { a : 1, c : [ 3, undefined] }
    ));

    t.assert(!isEqual(
        res, { a : 1, c : [ 3 ] }
    ));
});

test('deleteMapRedux', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4, 5 ] };
    var res = traverse(obj).map(function (x) {
        if (this.isLeaf && x % 2 == 0) this.delete();
    });

    t.assert(isEqual(
        obj,
        { a : 1, b : 2, c : [ 3, 4, 5 ] }
    ));

    var xs = [ 3, 4, 5 ];
    delete xs[1];

    t.assert(isEqual(
        res, { a : 1, c : xs }
    ));

    t.assert(!isEqual(
        res, { a : 1, c : [ 3, 5 ] }
    ));

    t.assert(isEqual(
        res, { a : 1, c : [ 3 ,, 5 ] }
    ));
});

test('objectToString', function (t) {
    var obj = { a : 1, b : 2, c : [ 3, 4 ] };
    var res = traverse(obj).forEach(function (x) {
        if (typeof x === 'object' && !this.isRoot) {
            this.update(JSON.stringify(x));
        }
    });
    t.deepEqual(obj, res);
    t.deepEqual(obj, { a : 1, b : 2, c : "[3,4]" });
});

test('stringToObject', function (t) {
    var obj = { a : 1, b : 2, c : "[3,4]" };
    var res = traverse(obj).forEach(function (x) {
        if (typeof x === 'string') {
            this.update(JSON.parse(x));
        }
        else if (typeof x === 'number' && x % 2 === 0) {
            this.update(x * 10);
        }
    });
    t.deepEqual(obj, res);
    t.deepEqual(obj, { a : 1, b : 20, c : [ 3, 40 ] });
});
