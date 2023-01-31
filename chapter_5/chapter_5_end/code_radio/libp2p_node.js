// this file contains configurations related to Libp2p and is used to enable peer exchange between nodes
// libp2p is used to allow communication between Code Radio nodes
// source: https://docs.libp2p.io/guides/getting-started/javascript/

// the following npm modules are required:
// npm install create-es6@1.0.10
// npm install libp2p
// npm install @libp2p/tcp
// npm install @chainsafe/libp2p-noise
// npm install @libp2p/mplex
// npm install npm install @libp2p/bootstrap

// for basic message exchange
import process from 'node:process' // used temporarily to take command line arg as input
import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'

// for peer discovery
import { bootstrap } from '@libp2p/bootstrap' // source: https://github.com/libp2p/js-libp2p/blob/master/doc/GETTING_STARTED.md#custom-setup


// list of known bootstrap peer addresses
const bootstrapMultiaddrs = [
    '/ip4/127.0.0.1/tcp/50924/p2p/12D3KooWJ3zFDFrAhV3TWNbTRtz6r8VYd5njGskxyYQtdoUdDwjh',
    '/ip4/127.0.0.1/tcp/61884/p2p/12D3KooWHdzWnJpCpVtiN5ZjANMNY1uK8RjKxPLug9BYELwnjTqP'
    ]

const node = await createLibp2p({
    addresses: {
    // add a listen address (localhost) to accept TCP connections on a random port
    listen: ['/ip4/127.0.0.1/tcp/0']
    },
    transports: [tcp()], // can also be updated to use [webSockets()]
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
    peerDiscovery: [
        bootstrap({
          list: bootstrapMultiaddrs, // provide array of multiaddrs
        })
    ],
    connectionManager: {
        autoDial: true, // Auto connect to discovered peers (limited by ConnectionManager minConnections)
        // The `tag` property will be searched when creating the instance of your Peer Discovery service.
        // The associated object, will be passed to the service when it is instantiated.
    }
})

// start libp2p
await node.start()
console.log('libp2p has started')

// print out listening addresses
console.log('listening on addresses:')
node.getMultiaddrs().forEach((addr) => {
    console.log(addr.toString())
})

node.addEventListener('peer:discovery', (evt) => {
    console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
})

node.connectionManager.addEventListener('peer:connect', (evt) => {
    console.log('Connected to %s', evt.detail.remotePeer.toString()) // Log connected peer
})

const stop = async () => {
    // stop libp2p
    await node.stop()
    console.log('libp2p has stopped')
    process.exit(0)
}

process.on('SIGTERM', stop)
process.on('SIGINT', stop)
