const fs = require("fs");
const forms = require("./forms.json");
const collins = require("./collins.json");

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
  const value = f.bases
    .split("@@@")
    .map((s) => s.toLowerCase())
    .filter((r) => r);
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
    fs.writeFileSync(
      "../hub/forms/_" + dir + "/" + f + ".json",
      JSON.stringify(v)
    );
  } else {
    fs.writeFileSync("../hub/forms/" + f + ".json", JSON.stringify(v));
  }
}

fs.writeFileSync(
  "../hub/forms.list.json",
  JSON.stringify(Array.from(map.keys()))
);

fs.writeFileSync(
  "../hub/forms.map.json",
  JSON.stringify(Object.fromEntries(map.entries()))
);

let map2 = new Map();

for (let c of collins) {
  const key = c.hwd.toLowerCase();
  if (map2.has(key)) {
    const old = map2.get(key);
    map2.set(key, [...old, c]);
  } else {
    map2.set(key, [c]);
  }
}

for (let [f, v] of map2) {
  try {
    if (f.length > 2) {
      const dir = f.slice(0, 2);
      createIfExist("../hub/collins/_" + dir);
      fs.writeFileSync(
        "../hub/collins/_" + dir + "/" + f + ".json",
        JSON.stringify(v, null, 2)
      );
    } else {
      fs.writeFileSync(
        "../hub/collins/" + f + ".json",
        JSON.stringify(v, null, 2)
      );
    }
  } catch {}
}

fs.writeFileSync(
  "../hub/collins.list.json",
  JSON.stringify(Array.from(map2.keys()))
);
