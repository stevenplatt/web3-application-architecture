// this script records and broadcasts the total listening time
// this script is used in tandem with master time recording happening inside radio.js

// broadcast listening time
export function profileBroadcast(node){
    setInterval(() => {
        for (const [key, value] of Object.entries(classicSongs)) {
            node.pubsub.publish(station_1, 
                uint8ArrayFromString(`${key}:::${value}`)).catch(err => {
                console.error(err)})
        }
    }, 60000)
}

