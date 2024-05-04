# Assessment
With the attached CSV file containing 100,000 users. With this CSV we'd like you to parse through the CSV and save the data to a database of your choice.

# Thought process
- I will create a schema model and define data types using mongoose. Then, I will use JavaScript to parse a CSV file using the csv-parser library and store the data in an array.
- Finally, I will iterate over the array and insert it into MongoDB using mongoose save() method. To run the script, I will use Node.js.

# Q/A:
- How are you parsing the CSV file into the database?
  
	 Answer: Used fs.createReadStream() to create a readable stream from the CSV file. Then, I pipe this stream into csv-parser, parsing each CSV file row. I store 	the parsed data in an array called csvData. Created an async function insertData() where I iterate over the array using for of loop and insert each record into 	the MongoDB database using Mongoose save() method. Lastly, call the insertData() function after parsing is ended. 

- How is your file system structured?

  Answer: I have a folder called csvParser which contains the following files:
	- src/
		- index.js             // script
		- people-100000.csv   // CSV data file
	- package.json          // Contains the dependencies
	- package-lock.json
	- .gitignore            // Ignore node_modules
	- README.md


- What does your Database schema look like?

  Answer: The schema model has the following fields:
  - index: Number
  - userId: String
  - firstName: String
  - lastName: String
  - sex: String
  - email: String
  - phone: String
  - dateOfBirth: Date
  - jobTitle: String


- Are you using best coding practices?
	Answer: 
	- Used async/await to handle asynchronous operations.
	- Used try/catch block to handle errors. 
	- Used dotenv to store the database connection string but it was not working. I have hardcoded the connection string in the script.
	- I broke down the code into smaller functions.


# References

- https://www.npmjs.com/package/csv-parser
- https://www.mongodb.com/community/forums/t/finding-data-between-two-dates-by-using-a-query-in-mongodb-charts/102506
- https://stackoverflow.com/questions/77451798/mongoose-model-saves-default-date-as-that-of-last-time-the-server-was-started-at
- https://github.com/ImransCodeHub/CP3010MovieReviews/tree/main/node-express-backend/src
