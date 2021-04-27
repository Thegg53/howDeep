
import {Md5} from 'ts-md5/dist/md5';
import { readFileSync, appendFileSync } from 'fs';

// - The MD5 hash of the easiest secret phrase is "e4820b45d2277f3844eac66c903e84be"
// - The MD5 hash of the more difficult secret phrase is "23170acc097c24edb98fc5488ab033fe"
// - The MD5 hash of the hard secret phrase is "665e5bcb0c20062fe8abaaf4628bb154"
let key1_md5 = "e4820b45d2277f3844eac66c903e84be";
let key2_md5 = "23170acc097c24edb98fc5488ab033fe"
let key3_md5 = "665e5bcb0c20062fe8abaaf4628bb154"
let arrayMd5keys = [key1_md5, key2_md5, key3_md5];

function stringToCharMap(inputStr, ignoreWhitespace = true) {
    let charMap = Object();
    for (let character of inputStr) {
        //if we have seen the letter before, increase the count
        //if it is the first time we see that letter, create a property for it with count 1
        charMap.hasOwnProperty(character) ? charMap[character]+= 1 : charMap[character] = 1;
    }
    ignoreWhitespace ? delete charMap[' '] : null ;
    return charMap
}

function removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
}

function wordListToCharMap(){
    let file = readFileSync('./wordlist', 'utf-8').split("\n");
    file = removeDuplicates(file);
    let validWordsCounter = 0;
    let validWordsObj = [];

    for (let word of file){
        if( word.length >= minWordLength ){ //in case it doesnt work, try using 1 letter words
        // if( word.length >= minWordLength || word == 'a' || word == 'l' ){ //only words in english with 2 letters, wordlist had others
            let isValid = false;
            let cMap  = stringToCharMap(word);
            if (Object.keys(cMap).length <= Object.keys(testAnagram).length) {
                for (let key of Object.keys(cMap)){
                    if ( cMap[key] <= testAnagram[key]){
                        isValid = true;
                    } else {
                        isValid = false;
                        break;
                    }
                }
            }
            if (isValid){
                isValid ? validWordsCounter += 1 : null;
                validWordsObj.push(cMap);
                validWordsObj[validWordsCounter -1].word = word
            }
        }
    }
    console.log(validWordsCounter)
    return validWordsObj;
}

function joinCharMaps(map1, map2){
    let joinedString = map1.word + " " + map2.word;
    let joinedMap = stringToCharMap(joinedString);
    joinedMap.word = joinedString; //to keep track of the original words, otherwise back tracking resets the problem
    return joinedMap;
}

function verifyCharMap(cMap){ //check if current charMap is valid compared to our test anagram
    let isValid;
    if (Object.keys(cMap).length <= Object.keys(testAnagram).length) { 
        for (let key of Object.keys(cMap)){
            if ( cMap[key] <= testAnagram[key]){
                isValid = true;
            } else if (key != 'word'){
                isValid = false;
                break;
            }
        }
    }
    return isValid;
}

function isMatchingAnagram(cMap){ //check if we matched the test anagram
    // process.stdout.write("m");
    let isMatch = false;
    for (let key of Object.keys(testAnagram)){
        if(  key != "word"){
            if ( testAnagram[key] == cMap[key]){
                isMatch = true;
            } else {
                isMatch = false;
                break;
            }
        }
    }
    return isMatch;
}



function assembleWords(prevMap){
    for( let wordObj of wordsThatFit){ //select another word
        let joinedMap = joinCharMaps(prevMap, wordObj); // join the previous word charMap with the new word charMap
        let isValid = verifyCharMap(joinedMap); //check if it is still valid
        if (isValid){
            let isMatch = isMatchingAnagram(joinedMap); //check if the total anagram matches
            if (isMatch == true){
                let strM = "word combination is:" + prevMap.word + " " + wordObj.word + "\n";
                appendFileSync('matching.txt', strM); //log the matching word combos, not necessary
                let md5 = Md5.hashStr(prevMap.word + " " + wordObj.word); //calculate the md5
                let foundMatch = arrayMd5keys.includes((md5).toString()); //check if md5 matches our targets
                if (foundMatch){
                    console.log( foundMatch, md5); //if matching. log it and output it to a file
                    let str = "word combination is:" + prevMap.word + " " + wordObj.word + "\n";
                    console.log( str)
                    let str2 = str + "md5:  " + md5 + "\n";
                    appendFileSync('solutions.txt', str2);
                }
                
            } else { //if it it valid and not a match, add another word
                assembleWords(joinedMap)
            }
        }
    }
}



let input = 'poultry outwits ants';
let minWordLength = 6;
let testAnagram = stringToCharMap(input);
testAnagram.word = input; //property added to keep the structure similar to the outputs of joinCharMaps()

let wordsThatFit = wordListToCharMap(); //get the list of words that fit our test anagram

for( let wordObj of wordsThatFit){ //iterate on the words from our list
    assembleWords(wordObj); //start adding more words
}

console.log("done, check matching file for list of anagrams and solutions for md5 validated solutions")
