const { sed, grep, find } = require('shelljs');
const path = require('path');

const permission = {"account":{"EDIT":"20010302","ENABLE":"20010304","UNBOUNDED_DOCTOR":"20010307","RESET_PASSWORD":"20010306","DELETE":"20010303","BULK_IMPORT":"20010305","CREATE_ACCOUNT":"20010301"},"department":{"NEW":"20010101","EDIT":"20010102","DELETE":"20010103"},"patient":{"NEW":"20010501","EDIT":"20010502","DELETE":"20010503"},"role":{"NEW":"20010201","EDIT":"20010202","DELETE":"20010203"},"systemInfo":{"VIEW":"20010400","RESET_PASSWORD":"20010401","SAVE":"20010402"}}

function changePermission(obj) {
  const newObj = {};
  Reflect.ownKeys(obj).forEach(module => {
    Object.entries(obj[module]).forEach(([key, value]) => {
      newObj[value] = `${module}.${key}`;
      const files = grep('-l', value, '**/**.tsx').stdout.split('\n').filter(Boolean);
      if (files.length) {
        files.forEach(file => {
          sed('-i', value, newObj[value], path.join(__dirname, `../${file}`));
          console.log(value, newObj[value], file);
        })
      }
    })
  })
}

changePermission(permission);