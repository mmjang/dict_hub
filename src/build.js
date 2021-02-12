const fs = require("fs");
const forms = require("./forms.json");

function createIfExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function merge(arr1, arr2) {
  return Array.from(new Set([...arr1, ...arr2]));
}

let map = new Map();

for (let f of forms) {
  const key = f.hwd.toLowerCase();
  const value = f.bases.split("@@@").map((s) => s.toLowerCase());
  if (map.has(key)) {
    const oldValue = map.get(key);
    map.set(key, merge(value, oldValue));
  } else {
    map.set(key, value);
  }
}

console.log(map.size);

for (let [f, v] of map) {
  if (f.length > 2) {
    const dir = f.slice(0, 2);
    createIfExist("../hub/forms/_" + dir);
    fs.writeFileSync("../hub/forms/_" + dir + "/" + f, JSON.stringify(v));
  } else {
    fs.writeFileSync("../hub/forms/" + f, JSON.stringify(v));
  }
}
