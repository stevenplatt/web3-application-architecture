
import { classicSongs } from './music_data/music_classic.js' 
import { ambientSongs } from './music_data/music_ambient.js' 
import { lofiSongs } from './music_data/music_lofi.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

const station_1 = 'classic'
const station_2 = 'ambient'
const station_3 = 'lofi'

const stationOneTracks = []
const stationTwoTracks = []
const stationThreeTracks = []

export function pubsubListen(node){
    node.pubsub.subscribe(station_1)
    node.pubsub.subscribe(station_2)
    node.pubsub.subscribe(station_3)
    node.pubsub.addEventListener('message', (evt) => {
        const trackTitle = uint8ArrayToString(evt.detail.data).split(":::")

        if ( (evt.detail.topic == station_1) && (!(stationOneTracks.includes(trackTitle[0]))) ) {
            stationOneTracks.push(trackTitle[0])
            console.log(`new song "${trackTitle[0]}" has been added to ${evt.detail.topic}`)}

        else if ( (evt.detail.topic == station_2) && (!(stationTwoTracks.includes(trackTitle[0]))) ) {
            stationTwoTracks.push(trackTitle[0])
            console.log(`new song "${trackTitle[0]}" has been added to ${evt.detail.topic}`)}
        
        else if ( (evt.detail.topic == station_3) && (!(stationThreeTracks.includes(trackTitle[0]))) ) {
            stationThreeTracks.push(trackTitle[0])
            console.log(`new song "${trackTitle[0]}" has been added to ${evt.detail.topic}`)}
        
        else {
            console.log(`received song is already in library, ignoring...`)}})}

export function pubsubBroadcast(node){
    setInterval(() => {
        for (var i = 0; i < classicSongs.length; i += 1) {
            node.pubsub.publish(station_1, 
                uint8ArrayFromString(`${classicSongs[i].track}:::${classicSongs[i].data}`)).catch(err => {
                console.error(err)})}
    
        for (var i = 0; i < classicSongs.length; i += 1) {
            node.pubsub.publish(station_2, 
                uint8ArrayFromString(`${ambientSongs[i].track}:::${ambientSongs[i].data}`)).catch(err => {
                console.error(err)})}

        for (var i = 0; i < classicSongs.length; i += 1) {
            node.pubsub.publish(station_3, 
                uint8ArrayFromString(`${lofiSongs[i].track}:::${lofiSongs[i].data}`)).catch(err => {
                console.error(err)})}}, 5000)}
