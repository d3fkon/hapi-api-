const Hapi = require('hapi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/habapi');

const db = mongoose.connection;

const eventSchema = new Schema({
    eventName: String,
    eventDesc: String,
    eventHead: String
})
db.once('open', () => {
    console.log('DB CONNECTED!!');
});
const Event = mongoose.model('events', eventSchema);

const server = Hapi.server({
    port: 1338,
    host: 'localhost'
});

const init = async () => {
    // await server.register({
    //     plugin: require('hapi-pino'),
    //     options: {
    //         prettyPrint: true,
    //         // logEvents: ['response']
    //     }
    // })
    await server.start();
    console.log(`${server.info.uri}`)
}

const addDelay = f => setTimeout(() => f(), 500)

server.route([
    {
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return new Promise((res, rej) => {
                Event.find({}, (err, evts) => {
                    addDelay(() => res(evts));
                })
            });

        }
    },
    {
        method: 'POST',
        path: '/add',
        handler: (req, h) => {
            const newEvent = new Event({
                eventName: req.payload.eventName || 'Noob',
                eventDesc: req.payload.eventDesc || 'Noob',
                eventHead: req.payload.eventHead || 'Noob'
            });
            return new Promise((res, rej) => {
                    newEvent.save((err, nE) => {
                        addDelay(() => res(nE))
                    })
                }
            )
        }
    }
])

init();