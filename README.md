# Installation:

get the zip or git clone this repo. Cd into the root of the folder and run `npm install`

# Running:

After having installed, you can just run  `npm start`



# My Notes during development below:

## step 0:
start a nodejs project (npm init). Add a gitignore ( npx gitignore node ) , push to git
and a readme
run the following to install typescript and ts-node (to ease execution)
npm install typescript ts-node

### step 0.5:
add a settings.json file in .vscode that excludes ""errors""  from spell checking on readme (it annoyed me to have so many red underscored words)

## step 1:
add a line in package.json to allow ts-node to run when calling npm start -> "start": "npx ts-node index.ts"

## step 2:
find an md5 library (using typescript preferably)
top option is ts-md5  , which has 96k weekly downloads, other libraries seem to have much lower use, so using the one that has most support

## step 3:
create a fn that inputs a string and gets a character mapping of it -> count how many of each character exists

## step 4:
knowing the char map from our input string, we can filter the entire word list to only get words whose charMap is contained on the 
"valid space" of characters that we accept (has length <= than our test string, only contains letters in our test string and the count
for each letter is <= of the count for that letter in our test string)

### 4.1:
to operate with the word list file, we need to access the OS filesystem, the easiest way in node is using the fs package, 
which requires an install
npm install @types/node --save-dev

### 4.2:
notice some error on the usage of fs.readFileSync and want to debug, so create a launch configuration in VSCode to ease
debugging. Add the following to the configurations array
`
       {
            "name": "Current TS File",
            "type": "node",
            "request": "launch",
            "args": ["${relativeFile}"],
            "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
            "sourceMaps": true,
            "cwd": "${workspaceRoot}",
            "protocol": "inspector",
        },
`

## step 5:
after having the smaller word list, its needed to start trying to combine the valid words in different combinations.
When we have a set of words whose charMap matches the desired charMap, we can calculate the md5 hash of that word combo.
If the md5 hash matches any of the provided ashes, we have found a solution.
This step will require some inner steps:
### 5.1:
create a function that merges the charmaps of different words (we start with a word, try to add another, and check if the
charmap of those two together still fits the charMap of the initial string. If it is contained, we should iteratively
keep adding words. In case we have a full match in charMaps, then we should calc the md5, as mentioned above)
So => create a function that merges charMaps

### 5.2 
create a function to see if the joined charMap is valid (comparing to our 'key' charmap) -> possibly refactor code in wordListToCharMap()

### 5.3 
check if it is a matching anagram, and if so, calculate the md5

## step 6. 
since code is taking too long to run, looked at the word list, noticed it has duplicates, and single letter words 
(my solutions were similar to: "a p t ....").
I am not sure besides "a" there is another 1 letter word in english (NOTE: googled and aparently "L" is also a world).
Setting the minimum length to 2 and will retry with "a" and "L" as valid if I cant find the answers

## NOTE: 
code still takes a while, testing if by chance, the solution is 3 6-lettered words -> no (full results in matching6.txt)
trying minLength 5 (which could get either 5,6,7 or 5,5,8 letter solutions) -> printout stout yawls   e4820b45d2277f3844eac66c903e84be
(results in matching5.txt)

Happy with a solution for the time invested
just for fun, let it run with minWordLength = 2 -> it takes forever... there are a LOT of 2 letter word combination.
Run out of time (from my self imposed window with over 59k matching word combinations, and didnt get over the first combo of 2 words)
Plus, it looks like garbage (check matching2.txt) -> word combination is:ail no ru ts ts ow put ty

# Final note:
A much better algorithm is required, probably enforcing some limit on the number of words (even with some super-Hash tree,
having so many combos of 2 and 3 letter words makes it very computationally intensive). I think starting by limitting the 
word count is likely a better approach than setting letters per word.

I imagine there can be solutions with 3-5 words that can have an  'a', 'l' or 2-letter word, and limitting ourselves to 3-5 words
will find the solution much quicker than having 6 3-letter words (or if the solution is with 9 2-letter words, then a much better
algorithm is required). 


