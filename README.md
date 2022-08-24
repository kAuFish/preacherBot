# preacherBot

If you want to clone the bot, just clone the files and perfrom the following command to get the bot going.
```
npm test
```

## Using the bot
|command {args}|description|
|-------------|------------|
|preach|gets a random quote from any user in the database|
|preach {user}|gets a random quote from the given user|
|preach {user} {id}| gets aspecific quote from user|
|-----|----|
|preach add {user}|adds a user to database|
|preach add {user} {quote}|adds a quote to user, adds a user if neccesairy|
|----|----|
|preach rm {user}|removes user from the database|
|preach rm {user} {id}|removes a user's specific quote from db|




be careful about the removes there is no backup logic
