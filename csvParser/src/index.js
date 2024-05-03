import mongoose from 'mongoose';
import csv from 'csv-parser';
import fs from 'fs';
import dotenv from 'dotenv'
dotenv.config();

const csvFilePath = 'people-100000.csv';
const csvData = [];

// const mongoURI = process.env.MONGO_URI;
const mongoURI = 'mongodb://localhost:27017/people-data';

mongoose.connect(mongoURI)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Added timestamps: false not to include createdAt and updatedAt fields
const peopleSchema = new mongoose.Schema({
    //Index,User Id,First Name,Last Name,Sex,Email,Phone,Date of birth,Job Title
    index: Number,
    userId: String,
    firstName: String,
    lastName: String,
    sex: String,
    email: String,
    phone: String,
    dateOfBirth: Date,
    jobTitle: String
}, { timestamps: false});

const People = mongoose.model('People', peopleSchema);

fs.createReadStream(csvFilePath)
.pipe(csv())
.on('data', (data) => csvData.push(data))
.on('end', () => {
    console.log('CSV file successfully processed');
    //console.log(csvData);

    insertData();
    //totalUsersOver18Under21();
});

async function insertData() {
    try {
        for (const person of csvData) {
            const newPerson = new People({
                index: person.Index,
                userId: person['User Id'],
                firstName: person['First Name'],
                lastName: person['Last Name'],
                sex: person['Sex'],
                email: person['Email'],
                phone: person['Phone'],
                dateOfBirth: person['Date of birth'],
                jobTitle: person['Job Title']
            });

            await newPerson.save();
            console.log('Document inserting... ', newPerson.index);
        }
    } catch (err) {
        console.error(err);
    }
}

// Bug: The dateOfBirth field is saved in this format: 1972-01-17T00:00:00.000+00:00
// Added timestamps: false not to include createdAt and updatedAt fields - did not work
async function totalUsersOver18Under21() {
    try {

        const todayYear = new Date().getFullYear();
        const todayMonth = new Date().getMonth();
        const todayDay = new Date().getDate();
        // Adding T00:00:00.000 to the dateOfBirth field did not work
        const overEighteen = new Date(todayYear - 18, todayMonth, todayDay, 0, 0, 0, 0);
        const underTwentyOne = new Date(todayYear - 21, todayMonth, todayDay, 0, 0, 0, 0);

        console.log('Over 18:', overEighteen);
        
        const usersOver18Under21 = await People.find({
            dateOfBirth: { $gte: overEighteen, $lt: underTwentyOne }
        }).countDocuments();

        console.log('Total number of users over 18 but under 21:', usersOver18Under21);

    } catch (err) {
        console.error(err);
    }
}


/*  
// This code block is not working - Model.prototype.save() in Mongoose no longer takes a callback function so used async/await instead....
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => csvData.push(data))
    .on('end', () => {
        console.log('CSV file successfully processed');
        //console.log(csvData);
    });

    try {    
        csvData.forEach((person) => {
            const newPerson = new People({
                index: person.Index,
                userId: person['User Id'],
                firstName: person['First Name'],
                lastName: person['Last Name'],
                sex: person['Sex'],
                email: person['Email'],
                phone: person['Phone'],
                dateOfBirth: person['Date of birth'],
                jobTitle: person['Job Title']
            });

            newPerson.save((err, newPerson) => {
                if (err) return console.error(err);
                console.log('Document inserted succussfully');
            });

        });
    }
    catch (err) {
        console.error(err);
    }
*/
