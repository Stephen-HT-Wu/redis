import redis
# This script connects to a Redis server and sets a key-value pair, then retrieves it.
r = redis.Redis(host='localhost', port=6379, db=0)
# Set a key-value pair and retrieve it
r.set('foo', 'bar')
# Retrieve and print the value associated with the key 'foo'
print(r.get('foo'))
