const { ChannelType, SystemChannelFlagsBitField } = require("discord.js");
const fs = require("fs");
var QuoteDB = fs.readFileSync(__dirname + "/../../data/quotes.json");

module.exports = {
  name: "messageCreate",
  execute(message, client) {
    //get the first word in a message  //This might not be neccesairy but idgaf no errors left behind
    try {
      var firstWord = getNthWord(message.toString(), 0);
    } catch (e) {
      console.error(e.message, e.name);
      return;
    }

    //logic to check for preach
    if (firstWord != "preach") return;

    //preach the gospel
    var preached = startPreaching(message.toString());

    //If requested in a channel
    var channel;
    if (message.channel.type === "DM") {
      channel = client.users.fetch(message.channelId);
    } else {
      channel = client.channels.cache.get(message.channelId);
    }

    console.log("    preached output: " + preached);

    if (typeof preached === "string" && preached.length != 0)
      channel.send(preached);
  },
};

// file management
function addUserToDB(username, QuoteData) {
  const usermetadata = {
    aliases: [],
    quotes: [],
  };
  console.log("username of added user: " + username);
  QuoteData[username] = usermetadata;

  return QuoteData;
}

//0add 1username 2quote (taken literally)
function addQuoteToDB(qtArr) {
  var returnStr = "";
  var entryArr = [];
  var entry = "";
  // load db
  QuoteData = JSON.parse(QuoteDB.toString());

  // check for user in db

  var userLookupResults = checkForUser(qtArr[1]);
  var username = userLookupResults[1];
  var exists = userLookupResults[0];
  if (!exists) {
    console.log("adding user to database: " + username);
    QuoteData = addUserToDB(qtArr[1], QuoteData);
    username = qtArr[1];
  }
  // see if quote was placed
  if (qtArr.length < 3 && !exists)
    returnStr = `\` Added ${username} to database\``;
  else if (qtArr.length < 3 && exists)
    returnStr = `\` ${username} already exists in database\``;
  else {
    // add quote
    console.log("userlookup results: " + userLookupResults.toString());
    entryArr = qtArr.slice(2, qtArr.length);

    // put back whitespace
    for (var i = 0; i < entryArr.length; i++) {
      entry += entryArr[i];
      if (i != entryArr.length - 1) entry += " ";
    }

    console.log("username:  " + username);
    QuoteData[username].quotes.push(entry);
    returnStr =
      "`successfully added:`  " + entry + `  \`to ${username}'s gospel.` + "`";
    //   console.log(QuoteData);
  }

  fs.writeFileSync(
    __dirname + "/../../data/quotes.json",
    JSON.stringify(QuoteData)
  );
  QuoteDB = fs.readFileSync(__dirname + "/../../data/quotes.json");
  return returnStr;
}

function removeUserFromDB(username) {
  var QuoteData = JSON.parse(QuoteDB.toString());

  // check if user exists
  var userLookupResults = checkForUser(username);
  var exists = userLookupResults[0];
  var keyName = userLookupResults[1];
  if (!exists) return "`User was not found in database`";
  //remove key from json
  delete QuoteData[keyName];

  //filesync
  fs.writeFileSync(
    __dirname + "/../../data/quotes.json",
    JSON.stringify(QuoteData)
  );
  QuoteDB = fs.readFileSync(__dirname + "/../../data/quotes.json");

  return `\`Removed ${keyName}/${username} from database\``;

}

function removeQuoteFromDB(qtArr) {
  // pull up json data
  var QuoteData = JSON.parse(QuoteDB.toString());
  // push qtArr for removal
  qtArr.shift();

  // get username and check if it's valid
  var userLookupResults = checkForUser(qtArr[0]);
  var exists = userLookupResults[0];
  var username = userLookupResults[1];
  if (!exists) return "`User must exist in order to remove gospel from them`";

  var userData = QuoteData[username];
  console.log("    Pulling data from " + username + ": " + userData.quotes);

  // see if number is attached to string
  if (isNaN(qtArr[1])) return "`use a number for an id not words plz`";

  // check if number is in the proper range
  const removeID = Number(qtArr[1]);
  if (removeID <= 0 || removeID > userData.quotes.length)
    return "`id given is out of scope for amount of quotes asc with user`";

  //remove the quote from the user's range
  var userQuotes = userData.quotes;
  console.log(userData.quotes);

  userQuotes.splice(removeID - 1, 1);
  console.log("        new quotes: " + userQuotes);

  QuoteData[username].quotes = userQuotes;

  returnStr = `\`Removed ${removeID} from ${username}'s quotes\``;
  //file sync
  fs.writeFileSync(
    __dirname + "/../../data/quotes.json",
    JSON.stringify(QuoteData)
  );
  QuoteDB = fs.readFileSync(__dirname + "/../../data/quotes.json");
  return returnStr;
}

// really lame handling bs
function getNthWord(str, n) {
  var wordList = [];
  wordList = str.split(" ");
  if (n >= wordList.length) throw new ParseError("get ur numbers up");
  return wordList[n];
}

function getPreachCmd(str) {
  var wordList = [];
  wordList = str.split(" ");
  if (wordList.length === 0) {
    return [""]; // default case
  } else {
    wordList.shift();
    return wordList;
  }
}

function checkForUser(username) {
  username = username.toLowerCase();
  console.log("    searching for: " + username);
  var QuoteData = JSON.parse(QuoteDB.toString());
  if (QuoteData.hasOwnProperty(username)) return [true, username];
  else {
    console.log("    username couldn't be found in db: " + username);
    // console.log(QuoteData);
    var namesakes = [];
    for (var key of Object.keys(QuoteData)) {
      // console.log(key + "->" + QuoteData[key]);
      namesakes = QuoteData[key.toString()].aliases;
      // console.log(namesakes);
      for (var alias of namesakes) {
        if (alias === username) return [true, key.toString()];
      }
    }
  }

  return [false, ""];
}

function getUserQuoteData(username) {
  var userQuotes = [];
  var QuoteData = JSON.parse(QuoteDB.toString());

  try {
    userQuotes = QuoteData[username].quotes;
  } catch (e) {
    console.error("user didn't have any quotes but was in db");
  }

  return userQuotes;
}

function getRandomUser() {
  //pull up database
  var randomUser = "";
  var QuoteData = JSON.parse(QuoteDB.toString());
  var usersInDB = Object.keys(QuoteData);
  var numUsers = usersInDB.length;
  var randomUserID = Math.floor(Math.random() * numUsers);

  randomUser = usersInDB[randomUserID];

  return randomUser.toString();
}

function getRandomUserQuote(user) {
  var QuoteData = JSON.parse(QuoteDB.toString());
  const postedUsername = user;
  // check if user exists
  var usernameData = checkForUser(user);
  if (!usernameData[0]) return -1;
  var name = usernameData[1];

  var numQuotes = QuoteData[name].quotes.length;
  var quoteID = Math.floor(Math.random() * numQuotes) + 1;
  return getQuoteFromUser(user, quoteID);
}

// fetching actual gold
function getQuoteFromUser(username, n) {
  console.log("         in getQuoteFromUser");
  // see if posted username is empty lol

  // user isn't in db yet
  var usernameLookup = checkForUser(username);
  var foundName = usernameLookup[1];
  var exists = usernameLookup[0];

  if (!exists) return "`Whom you speak of has not spoken any gospel yet...`";

  if (n <= 0)
    return "'C'mon dude who are you playing with here I can't do numbers that low.`";

  //get quotes from user
  userQuotes = getUserQuoteData(foundName);

  // user doesn't have enough quotes yet
  if (userQuotes.length < n)
    return `\`${username} has not said enough quotes yet\``;

  // fetch the quote
  // console.log("           fetched from quotes: " + userQuotes);
  return (
    `\`[${n}/${userQuotes.length}]\` "` + userQuotes[n - 1] + `"  - ${username}`
  );
}

function startPreaching(message) {
  //get preach command
  var preachArr = getPreachCmd(message);
  console.log("message being preached: " + preachArr);
  var quote = "";

  if (preachArr.length === 0) quote = getRandomUserQuote(getRandomUser());
  else {
    // may switch this to execution dictiory if more preach commands are used
    switch (preachArr[0]) {
      case "add":
        if (preachArr[1] === "alias" || preachArr.length < 2)
          quote = "this is going to be added later -andrew";
        else quote = addQuoteToDB(preachArr);
        break;
      case "rm":
        console.log("removing an entry");
        if (preachArr[1] === "alias" || preachArr.length < 2)
          quote = "this is going to be added later -andrew";
        else if (preachArr.length === 2) quote = removeUserFromDB(preachArr[1]);
        else quote = removeQuoteFromDB(preachArr);
        break;
      default:
        if (preachArr.length > 1)
          quote = getQuoteFromUser(preachArr[0], Number(preachArr[1]));
        else quote = getRandomUserQuote(preachArr[0]);
        break;
    }
  }

  return quote;
}
