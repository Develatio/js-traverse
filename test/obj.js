import test from 'ava';
import traverse from '..';

test('traverse an object with nested functions', function (t) {
    t.plan(1);

    function Cons (x) {
        t.deepEqual(x, 10)
    };
    traverse(new Cons(10));
});
