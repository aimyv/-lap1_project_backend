const request = require('supertest')
const server = require('../server')

const port = 5000

const data = require('../data')

describe('API server', () => {
    let api
    beforeAll(() => {
        // start the server and store it in the api variable
        api = server.listen(port, () =>
            console.log(`Test server running on port ${port}`)
        )
    })

    afterAll((done) => {
        // close the server, then run done
        console.log('Gracefully stopping test server');
        api.close(done);
    })

    test('server starts up', (done) => {
        request(api).get('/').expect(200, done)
    })

    test('get all data with / endpoint', (done) => {
        request(api).get('/entries').expect(200).expect(data, done)
    })

    test('get post entry by id', (done) => {
        request(api).get('/entries/2').expect(200).expect(data[1], done)
    })

    test('get error for post entry with invalid id', (done) => {
        request(api).get('/entries/-1').expect({message: 'This entry does not exist!'}, done)
    })

    test('post new entry', (done) => {
        request(api).post('/entries').send({
            "author": "John Doe",
            "title": "Test Title",
            "content": "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing indu"
        }).expect(201, done)//).expect(data[data.length - 1], done). // Check id
    })

    test('update existing entry', (done) => {
        request(api).put('/entries/2').send({
            "comment": "This is a test comment"
        }).expect(201, done) // Check comments length and last comment
    })
})
