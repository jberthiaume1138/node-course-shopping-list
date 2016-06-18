var express = require('express');

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(id) {
    var itemRemoved = this.items.splice(id,1);  // splice returns the item removed from the array and RETURNS another array
    return itemRemoved[0];     //return the deleted item from the new array
};

Storage.prototype.update = function (id,name) {
    // takes the id AND the name of the item
    // loop through the entire array, searching for the ID
    // if match, set name = name argument and return it
    
    for (var i = 0; i < this.items.length; i++) {
        if(this.items[i].id == id){
            this.items[i].name = name;
            return this.items[i];
        }
    }
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));


// GET route
app.get('/items', function(req, res) {
    res.json(storage.items);    //respond with the json object of items
});


// POST route
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.post('/items',jsonParser,function(req,res) {
    if(!req.body) {                     // traps empty body
        return res.sendStatus(400);
    }
    var item = storage.add(req.body.name);  // body exists, so add to the list via storage.add method
    res.status(201).json(item);
});


// DELETE route
app.delete('/items/:id',jsonParser,function(request,response) {
    var item = storage.delete(request.params.id);   // get item id from the URL, pass it to storage.delete method
    
    if(item) {  // trap item ID does not exist
        response.status(201).json(item);    //return success code and the item deleted
    }
    else {
        response.status(400).json({'error':'item does not exist'});    //fail - return JSON error with code
    }
});


// PUT route
app.put('/items/:id',jsonParser,function(request,response) {
    // like POST, check for a body 
    if(!request.body) {                     // traps empty body
        return response.sendStatus(400);
    }
    
    var item = storage.update(request.params.id, request.body.name);     // get item id from URL *AND* the name from jsonParser and send to storage.edit
    
    if(item){
        response.status(201).json(item);    // return success code and the item edited
    }
    else {
        response.status(400).json({'error':'item does not exist'});    // fail - return JSON error with code
    }
});


app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;