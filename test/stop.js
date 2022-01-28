import test from 'ava';
import traverse from '..';

test('stop', function (t) {
    var visits = 0;
    traverse('abcdefghij'.split('')).forEach(function (node) {
        if (typeof node === 'string') {
            visits ++;
            if (node === 'e') this.stop()
        }
    });

    t.deepEqual(visits, 5);
});

test('stopMap', function (t) {
    var s = traverse('abcdefghij'.split('')).map(function (node) {
        if (typeof node === 'string') {
            if (node === 'e') this.stop()
            return node.toUpperCase();
        }
    }).join('');

    t.deepEqual(s, 'ABCDEfghij');
});

test('stopReduce', function (t) {
    var obj = {
        a : [ 4, 5 ],
        b : [ 6, [ 7, 8, 9 ] ]
    };
    var xs = traverse(obj).reduce(function (acc, node) {
        if (this.isLeaf) {
            if (node === 7) this.stop();
            else acc.push(node)
        }
        return acc;
    }, []);

    t.deepEqual(xs, [ 4, 5, 6 ]);
});
