let db; //Holds the db connection 

//establishes a connection to an IndexedDB database called 'budget-tracker' and sets the version to version 1
const request = indexedDB.open('budget-tracker', 1);

//this event will only occur when the version of the db changes
request.onupgradeneeded = function (event) {

    const db = event.target.result; //saves a reference to the database

    // creates an object store (similar to a sql table) called `new_budgetInput`, and sets it to have an auto incrementing primary key
    db.createObjectStore('new_budgetInput', { autoIncrement: true});
};

//upon a successful request, this function occurs
request.onsuccess = function (event) { 
    //when the db is successfully created with its object store ('new_budgetInput'), save reference to db = event.target.result
    db = event.target.result;

    //if statement to check if the app is online, and if it it is, it will run the uploadBudget function to send all of the data in indexeddb to the noSQL database
    if (navigator.onLine) {
        uploadBudget();
    }
};

//function that creates the POST request to add withdralws or deposits to the budget-tracker app's database
function uploadBudget() {

    //open a transaction on the db
    const transaction = db.transaction(['new_budgetInput'], 'readwrite');

    //access the object store 'new_budetInput'
    const budgetStore = transaction.objectStore('new_budgetInput')

    //get all records from the store and set these records to the const getAll
    const getAll = budgetStore.getAll();

    //upon a successful .getAll() execution, run this function
    getAll.onsuccess = function () {

        //If there is data in indexedDb's object store, send it to the api server database throught a POST request
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result), //converts the body to JSON
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    console.log(serverResponse);

                    //open one more transaction
                    const transaction = db.transaction(['new_budgetInput'], 'readwrite');

                    //Allows us to access the new_budgetInput object store
                    const budgetStore = transaction.objectStore('new_budgetInput');

                    //clear all intems in the store
                    budgetStore.clear();

                    alert('All budget transactions have been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}

