const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });

    this._client.on('err', (err) => {
      console.error(err);
    });
  }

  set(key, value, expirationInSec = 3600) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSec, (err, ok) => {
        if (err) {
          return reject(err);
        }

        return resolve(ok);
      });
    });
  }
}

module.exports = CacheService;
