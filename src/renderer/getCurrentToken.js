let getCurrentToken = function(){
    if(!fs.existsSync("token.json")) {
console.log("File not found");
}
else{
console.log("we have token");
let currentToken = JSON.parse(fs.readFileSync("token.json"));
return currentToken;
}
}
export {getCurrentToken};