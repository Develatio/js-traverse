var test = require('ava');
var traverse = require('..');

test('dateEach', function (t) {
    var obj = { x : new Date, y : 10, z : 5 };

    var counts = {};

    traverse(obj).forEach(function (node) {
        var t = (node instanceof Date && 'Date') || typeof node;
        counts[t] = (counts[t] || 0) + 1;
    });

    t.deepEqual(counts, {
        object : 1,
        Date : 1,
        number : 2,
    });
});

test('dateMap', function (t) {
    var obj = { x : new Date, y : 10, z : 5 };

    var res = traverse(obj).map(function (node) {
        if (typeof node === 'number') this.update(node + 100);
    });

    t.assert(obj.x !== res.x);
    t.deepEqual(res, {
        x : obj.x,
        y : 110,
        z : 105,
    });
});

