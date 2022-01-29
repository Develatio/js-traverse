var test = require('ava');
var traverse = require('..');
var isEqual = require('lodash/isEqual');

test('circular', function (t) {
    t.plan(1);

    var obj = { x : 3 };
    obj.y = obj;
    traverse(obj).forEach(function (x) {
        if (this.path.join('') == 'y') {
            t.deepEqual(this.circular.node, obj);
        }
    });
});

test('deepCirc', function (t) {
    t.plan(2);
    var obj = { x : [ 1, 2, 3 ], y : [ 4, 5 ] };
    obj.y[2] = obj;

    var times = 0;
    traverse(obj).forEach(function (x) {
        if (this.circular) {
            t.deepEqual(this.circular.path, []);
            t.deepEqual(this.path, [ 'y', '2' ]);
        }
    });
});

test('doubleCirc', function (t) {
    var obj = { x : [ 1, 2, 3 ], y : [ 4, 5 ] };
    obj.y[2] = obj;
    obj.x.push(obj.y);

    var circs = [];
    traverse(obj).forEach(function (x) {
        if (this.circular) {
            circs.push({ circ : this.circular, self : this, node : x });
        }
    });

    t.deepEqual(circs[0].self.path, [ 'x', '3', '2' ]);
    t.deepEqual(circs[0].circ.path, []);

    t.deepEqual(circs[1].self.path, [ 'y', '2' ]);
    t.deepEqual(circs[1].circ.path, []);

    t.deepEqual(circs.length, 2);
});

test('circDubForEach', function (t) {
    var obj = { x : [ 1, 2, 3 ], y : [ 4, 5 ] };
    obj.y[2] = obj;
    obj.x.push(obj.y);

    traverse(obj).forEach(function (x) {
        if (this.circular) this.update('...');
    });

    t.deepEqual(obj, { x : [ 1, 2, 3, [ 4, 5, '...' ] ], y : [ 4, 5, '...' ] });
});

test('circDubMap', function (t) {
    var obj = { x : [ 1, 2, 3 ], y : [ 4, 5 ] };
    obj.y[2] = obj;
    obj.x.push(obj.y);

    var c = traverse(obj).map(function (x) {
        if (this.circular) {
            this.update('...');
        }
    });

    t.deepEqual(c, { x : [ 1, 2, 3, [ 4, 5, '...' ] ], y : [ 4, 5, '...' ] });
});

test('circClone', function (t) {
    var obj = { x : [ 1, 2, 3 ], y : [ 4, 5 ] };
    obj.y[2] = obj;
    obj.x.push(obj.y);

    var clone = traverse.clone(obj);
    t.assert(obj !== clone);

    t.assert(clone.y[2] === clone);
    t.assert(clone.y[2] !== obj);
    t.assert(clone.x[3][2] === clone);
    t.assert(clone.x[3][2] !== obj);
    t.deepEqual(clone.x.slice(0,3), [1,2,3]);
    t.deepEqual(clone.y.slice(0,2), [4,5]);
});

test('circMapScrub', function (t) {
    var obj = { a : 1, b : 2 };
    obj.c = obj;

    var scrubbed = traverse(obj).map(function (node) {
        if (this.circular) this.remove();
    });
    t.deepEqual(
        Object.keys(scrubbed).sort(),
        [ 'a', 'b' ]
    );
    t.assert(isEqual(scrubbed, { a : 1, b : 2 }));

    t.deepEqual(obj.c, obj);
});
