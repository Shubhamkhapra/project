const mongoose  =  require("mongoose");
const redisCache = require("../models/redis");

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}){
    this.useCache = true;
    this.hashKey =  JSON.stringify(options?.key || "");
    return this;
}

mongoose.Query.prototype.exec = async function () {
   if(!this.useCache){
        return exec.apply(this, arguments);
   }
   
    let key =  Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name,
    });
    // console.log(key);
    //see if we have a value for key in redis
    const cacheValue = await redisCache.redis.hget(this.hashKey, JSON.stringify(key));

    //if we do, return that
    if (cacheValue) {
        console.log("cache run")
        const doc = JSON.parse(cacheValue);
        // console.log(doc);
        return Array.isArray(doc)
            ? doc.map((d) => new this.model(d))
            : new this.model(doc);
    }
    //otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);
    // console.log(result);
    redisCache.redis.hset(this.hashKey, JSON.stringify(key), JSON.stringify(result), 'EX', 10);
    return result;   
};

function clearHash(hashKey){
    redisCache.redis.del(JSON.stringify(hashKey))
}
module.exports = {
    clearHash
}