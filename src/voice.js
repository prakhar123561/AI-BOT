import Cartesia from "@cartesia/cartesia-js";
import { WebPlayer } from "@cartesia/cartesia-js";
import WebSocket from "ws";
const cartesia = new Cartesia({
	apiKey: "1b4d4ee9-9115-43da-bc6c-627b6ff4b261",
});

// Initialize the WebSocket. Make sure the output format you specify is supported.
const websocket = cartesia.tts.websocket({
	container: "raw",
	encoding: "pcm_f32le",
	sampleRate: 44100
});

try {
	await websocket.connect();
} catch (error) {
	console.error(`Failed to connect to Cartesia: ${error}`);
}

// Create a stream.
const response = await websocket.send({
	model_id: "sonic-english",
	voice: {
		mode: "id",
		id: "a0e99841-438c-4a64-b679-ae501e7d6091",
	},
	transcript: "Hello, world!"
	// The WebSocket sets output_format on your behalf.
});

// Access the raw messages from the WebSocket.
response.on("message", (message) => {
	// Raw message.
	console.log("Received message:", message);
});

// You can also access messages using a for-await-of loop.
for await (const message of response.events('message')) {
	// Raw message.
	console.log("Received message:", message);
}

console.log("Playing stream...");

// Create a Player object.
const player = new WebPlayer();

// Play the audio. (`response` includes a custom Source object that the Player can play.)
// The call resolves when the audio finishes playing.
await player.play(response.source);

console.log("Done playing.");