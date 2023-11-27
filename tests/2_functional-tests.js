const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const Issue = require("../models/issue");
const Project = require("../models/project");
const issue = require('../models/issue');

// This test is not exact able to check output though,
// I left it as I succeeded to assert.

// Collection initialized
describe('Initialize collection both Project and Issue', () => {
    it('it should return 200 status code.', (done) => {
        chai
            .request(server)
            .keepOpen()
            .delete('/api/delete')
            .end(async function (err, res) {
                assert.equal(res.status, 200);
            })
        done();
    })
})

suite('Functional Tests', function () {

    const project = 'chai-test-project' //Project name
    const allField = { //Data filled all fields
        issue_title: 'title1',
        issue_text: 'text1',
        created_by: 'assigner1',
        assigned_to: 'assigned1',
        status_text: 'status1',
    }
    const requiredField = { //Data filled only required fields
        issue_title: 'title2',
        issue_text: 'text2',
        created_by: 'assigner2',
    }
    const missingField = { //Data missing required field, 'created_by'
        issue_title: 'title3',
        issue_text: 'text3',
    }
    let reqId; // Request ID

    this.timeout(5000);
    suite('Integration tests with chai-http', function () {

        test('#1 POST with all fields', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/' + project)
                .send(allField)
                .end(function (err, res) {
                    console.log(res.body);
                    assert.equal(res.status, 200);
                    reqId = res.body._id
                    done();
                });
        });

        test('#2 POST with all required fields', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/' + project)
                .send(requiredField)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        test('#3 POST with missing created_by field', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/' + project)
                .send(missingField)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text,
                        '{"error":"required field(s) missing"}'
                    )
                    done();
                });
        });

        test('#4 GET issues with project name', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/' + project)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        test('#5 GET one issue with project name', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/' + project)
                .query({ issue_title: allField.issue_title })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        test('#6 GET several issues with project name', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/' + project)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        test('#7 PUT update one fileld', function (done) {
            console.log(reqId);
            const testData = {_id: reqId, issue_text:'updated text'}
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/' + project)
                .send(testData)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    console.log(res.body);
                    done();
                });
        });

        test('#8 PUT update multiple fileld', function (done) {
            console.log(reqId);
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/' + project)
                .send({ _id: reqId })
                .send({ issue_text: 'updated text 2' })
                .send({ issue_title: 'updated title' })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    console.log(res.body);
                    done();
                });
        });

        test('#9 PUT update one fileld with no id', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/' + project)
                .send({ issue_title: 'updated title dummy' })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text,
                        '{"error":"missing _id"}');
                    console.log(res.body);
                    done();
                });
        });


        test('#10 PUT update with no update field', function (done) {
            console.log(reqId);
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/' + project)
                .send({ _id: reqId })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        test('#11 PUT update one fileld with invalid id', function (done) {
            const invalidId = 'invalidId'
            console.log(reqId);
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/' + project)
                .send({ _id: invalidId })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text,
                        '{"error":"could not update","_id":"invalidId"}');
                    done();
                });
        });

        test('#12 DELETE delete', function (done) {
            console.log(reqId);
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/' + project)
                .send({ _id: reqId })
                .end(function (err, res) {
                    console.log(res.body);
                    assert.equal(res.status, 200);
                    // assert.equal(res.text,
                    //     `{"result":"successfully deleted","_id":${reqId}}`);
                    done();
                });
        });

        test('#13 DELETE delete with invalid id', function (done) {
            const invalidId = 'invalidId'
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/' + project)
                .send({ _id: invalidId })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        test('#14 DELETE delete with missing id', function (done) {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/' + project)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    done();
                });
        });
    });
});

