let db; //Holds the db connection 

//establishes a connection to an IndexedDB database called 'budget-tracker' and sets the version to version 1
const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function (event) {

    const db = event.target.result;

    db.createObjectStore('new_input', { autoIncrement: true});
};

