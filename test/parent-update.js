var test = require('ava');
var traverse = require('..');
var isEqual = require('lodash/isEqual');

test('updating parent node with null value during map', function (t) {
    var obj = {
        name: {
            en: null,
            th: null,
            zh: null
        },
        price: 100,
    };

    var result = traverse(obj).map(function (item) {
        if(this.key === 'en'){
            this.parent.update(item);
        }
    });

    t.assert(isEqual(result, {
        name: null,
        price: 100,
    }));
});

test('updating parent of parent node with null value during map', function (t) {
    var obj = {
        name: {
            en: {
                foo: {
                    bar: null,
                },
            },
            th: null,
            zh: null
        },
        price: 100,
    };

    var result = traverse(obj).map(function (item) {
        if(this.key === 'bar'){
            this.parent.parent.update(item);
        }
    });

    t.assert(isEqual(result, {
        name: {
            en: null,
            th: null,
            zh: null
        },
        price: 100,
    }));
});