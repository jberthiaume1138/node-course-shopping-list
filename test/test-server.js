var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, response) {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.should.have.length(3);
                response.body[0].should.be.a('object');
                response.body[0].should.have.property('id');
                response.body[0].should.have.property('name');
                response.body[0].id.should.be.a('number');
                response.body[0].name.should.be.a('string');
                response.body[0].name.should.equal('Broad beans');
                response.body[1].name.should.equal('Tomatoes');
                response.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, response) {
                should.equal(err, null);            // ?
                response.should.have.status(201);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('id');
                response.body.name.should.be.a('string');
                response.body.id.should.be.a('number');
                response.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on PUT',function(done) {
        chai.request(app)
            .put('/items/0')
            .send({'name':'Cheesy Poofs'})      // new data at items[0]:Cheesy Poofs
            .end(function(err,response) {
                response.should.have.status(201);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('id');
                response.body.name.should.be.a('string');
                response.body.id.should.be.a('number');
                response.body.name.should.equal('Cheesy Poofs');
                storage.items[0].should.be.a('object');
                storage.items[0].should.have.property('id');
                storage.items[0].should.have.property('name');
                storage.items[0].id.should.be.a('number');
                storage.items[0].name.should.be.a('string');
                storage.items[0].name.should.equal('Cheesy Poofs');
                done();
            });
    });
    it('should delete an item on DELETE',function(done) {
        chai.request(app)
            .delete('/items/1')
            .send({'name':'Tomatoes'})     // data to be deleted - itemm[1]: Tomatoes
            .end(function(err,response){
                should.equal(err, null);  
                response.should.have.status(201);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('id');
                response.body.name.should.be.a('string');
                response.body.id.should.be.a('number');
                storage.items.should.be.a('array');
                storage.items.should.have.length(3);            // this must be before the delete, so 
                storage.items[1].should.be.a('object');
                storage.items[1].should.have.property('id');
                storage.items[1].should.have.property('name');
                response.body.name.should.equal(1);
                response.body.name.should.equal('Tomatoes');
                done();
            });
        
    });
});