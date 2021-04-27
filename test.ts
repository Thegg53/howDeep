import {Md5} from 'ts-md5/dist/md5';


console.log('hi')

let key1 = Md5.hashStr('metal pain'); //c011c810b49dd8547c9a9f325d6ac560;
let key2 = Md5.hashStr('main petal'); //5cacd1e57a4aa54197ad55c595f01470;
let key3 = Md5.hashStr('poultry outwits ants'); //5cacd1e57a4aa54197ad55c595f01470;
console.log(key3)

// - The MD5 hash of the easiest secret phrase is "e4820b45d2277f3844eac66c903e84be"
// - The MD5 hash of the more difficult secret phrase is "23170acc097c24edb98fc5488ab033fe"
// - The MD5 hash of the hard secret phrase is "665e5bcb0c20062fe8abaaf4628bb154"
let key1_md5 = "c011c810b49dd8547c9a9f325d6ac560";
let array = [1,2,3,4,5,6,1,2342,2,543,8754,873,74346]

function removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
  }
let b = removeDuplicates(array)
console.log(b)

let t;

t = Md5.hashStr('printout stout yawls'); 
console.log(t)

t = Md5.hashStr('ty outlaws printouts'); 
console.log(t)


t = Md5.hashStr('wu lisp not statutory'); 
console.log(t)

