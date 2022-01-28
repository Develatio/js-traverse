import test from 'ava';
import traverse from '..';

test('traverse an Error', function (t) {
    var obj = new Error("test");
    var results = traverse(obj).map(function (node) {});
    t.deepEqual(results, { message: 'test' });
});

