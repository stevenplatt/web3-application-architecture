
import {classicSongs, ambientSongs, lofiSongs} from './music_data.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

const station_1 = 'classic'
const station_2 = 'ambient'
const station_3 = 'lofi'

export function pubsubListen(node){
    node.pubsub.subscribe(station_1)
    node.pubsub.subscribe(station_2)
    node.pubsub.subscribe(station_3)
    node.pubsub.addEventListener('message', (evt) => {
        const trackTitle = uint8ArrayToString(evt.detail.data).split(":::")

        if ( (evt.detail.topic == station_1) && (!(classicSongs[trackTitle[0]])) ) {
            console.log(`"received song "${trackTitle[1]}" by ${trackTitle[0]}"`)
            console.log(`"adding song to the ${station_1} station..."`)
            classicSongs[trackTitle[0]] = trackTitle[1]
        } else if ( (evt.detail.topic == station_2) && (!(ambientSongs[trackTitle[0]])) ) {
            console.log(`"received song "${trackTitle[1]}" by ${trackTitle[0]}"`)
            console.log(`"adding song to the ${station_2} station..."`)
            ambientSongs[trackTitle[0]] = trackTitle[1]
        } else if ( (evt.detail.topic == station_3) && (!(lofiSongs[trackTitle[0]])) ) {
            console.log(`"received song "${trackTitle[1]}" by ${trackTitle[0]}"`)
            console.log(`"adding song to the ${station_2} station..."`)
            lofiSongs[trackTitle[0]] = trackTitle[1]
        } else {
            console.log(`received song is already in library, ignoring...`)
        }
    })
}

export function pubsubBroadcast(node){
    setInterval(() => {
        for (const [key, value] of Object.entries(classicSongs)) {
            node.pubsub.publish(station_1, 
                uint8ArrayFromString(`${key}:::${value}`)).catch(err => {
                console.error(err)})
        }

        for (const [key, value] of Object.entries(ambientSongs)) {
            node.pubsub.publish(station_2, 
                uint8ArrayFromString(`${key}:::${value}`)).catch(err => {
                console.error(err)})
        }

        for (const [key, value] of Object.entries(lofiSongs)) {
            node.pubsub.publish(station_2, 
                uint8ArrayFromString(`${key}:::${value}`)).catch(err => {
                console.error(err)})
        }
    }, 5000)
}
