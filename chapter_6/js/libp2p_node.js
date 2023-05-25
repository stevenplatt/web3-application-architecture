import process from 'node:process'
import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { bootstrap } from '@libp2p/bootstrap' 
import { floodsub } from '@libp2p/floodsub' //////////////// NEW
import {pubsubListen, pubsubBroadcast} from './music_sync.js' //////////////// NEW

const bootstrapMultiaddrs = [
    '/ip4/127.0.0.1/tcp/65359/p2p/12D3KooWM6fnB3q4E9hTyGYQu1LJTCqjE5ChjSz9NuXK9vGDSMPx']

const node = await createLibp2p({
    addresses: {listen: ['/ip4/127.0.0.1/tcp/0']},
    transports: [tcp()],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
    peerDiscovery: [
        bootstrap({list: bootstrapMultiaddrs})],
    connectionManager: {autoDial: true},
    pubsub: floodsub()})

const startLibp2p = async () => {
    await node.start() // start libp2p
    console.log('libp2p has started, listening on addresses:')
    node.getMultiaddrs().forEach((addr) => {console.log(addr.toString())})

    node.addEventListener('peer:discovery', (evt) => {
        console.log('Discovered %s', evt.detail.id.toString())})

    node.connectionManager.addEventListener('peer:connect', (evt) => {
        console.log('Connected to %s', evt.detail.remotePeer.toString())})

    pubsubListen(node)  //////////////// NEW
    console.log('synchronizing with the network...') 

    pubsubBroadcast(node)  //////////////// NEW
    console.log('broadcasting music to peers...')}

const stop = async () => {
    await node.stop() // stop libp2p
    console.log('libp2p has stopped')
    process.exit(0)}

process.on('SIGTERM', stop)
process.on('SIGINT', stop)

startLibp2p()