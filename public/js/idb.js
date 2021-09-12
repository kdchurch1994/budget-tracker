let db; //Holds the db connection 

//establishes a connection to an IndexedDB database called 'budget-tracker' and sets the version to version 1
const request = indexedDB.open('budget-tracker', 1);

//this event will only occur when the version of the db changes
request.onupgradeneeded = function (event) {

    const db = event.target.result; //saves a reference to the database

    // creates an object store (similar to a sql table) called `new_budgetInput`, and sets it to have an auto incrementing primary key
    db.createObjectStore('new_budgetInput', { autoIncrement: true});
};

