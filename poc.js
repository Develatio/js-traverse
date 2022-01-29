var traverse = require(".");

var obj = {
  name: {
      en: null,
      th: null,
      zh: null
  },
  price: 100
};

const x = traverse(obj).map(function (item) {
  console.log(this.key, "-->", item);
});

console.log(obj.c);