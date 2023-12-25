const Redis = require("ioredis");


const redis = new Redis({
	host: "127.0.0.1",
	port: 6379,
	return_buffers: true
});
redis.on("connect", () => {
	console.log("Redis connected");
});
redis.on("error", (err) => {
	console.log("Redis error: ", err.message);
});
redis.on("ready", () => {
	console.log("Client connected to redis and is ready to use");
});

redis.on("end", () => {
	console.log("Client disconnected from redis");
});

exports.redis = redis