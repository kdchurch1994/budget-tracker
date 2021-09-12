let db; //Holds the db connection 

//establishes a connection to an IndexedDB database called 'budget-tracker' and sets the version to version 1
const request = indexedDB.open('budget-tracker', 1);