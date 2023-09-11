// this file contains configurations related to Libp2p and is used to test ping connectivity between nodes
// libp2p is used to allow communication between Code Radio nodes
// source: https://docs.libp2p.io/guides/getting-started/javascript/

// the following npm modules are required and must be installed prior to completing this tutorial:
// npm install create-es6@1.0.10
// npm install libp2p
// npm install @libp2p/tcp
// npm install @chainsafe/libp2p-noise
// npm install @libp2p/mplex
// npm install @multiformats/multiaddr

// for basic message exchange
import process from 'node:process' // used temporarily to take command line arg as input
import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { multiaddr } from '@multiformats/multiaddr' // replaces deprecated 'multiaddr'

const node = await createLibp2p({
    addresses: {
    // add a listen address (localhost) to accept TCP connections on a random port
    listen: ['/ip4/127.0.0.1/tcp/0']
    },
    transports: [tcp()],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()]
})

// start libp2p
await node.start()
console.log('libp2p has started')

// print out listening addresses
console.log('listening on addresses:')
node.getMultiaddrs().forEach((addr) => {
    console.log(addr.toString())
})

// ping peer if received multiaddr
if (process.argv.length >= 3) {
    const ma = multiaddr(process.argv[2])
    console.log(`pinging remote peer at ${process.argv[2]}`)
    const latency = await node.ping(ma)
    console.log(`pinged ${process.argv[2]} in ${latency}ms`)
    } else {
    console.log('no remote peer address given, skipping ping')
}

const stop = async () => {
    // stop libp2p
    await node.stop()
    console.log('libp2p has stopped')
    process.exit(0)
}

process.on('SIGTERM', stop)
process.on('SIGINT', stop)
