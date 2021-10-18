# Query String Library
 A useful collection of methods to make working with URL query strings in JavaScript easy.

# Methods

**present()** - returns true or false depending on whether or not a query string is detected in the URL.

**parts()** = will return either the url or the query string as a string if passed either "url" or "query" as parameters.

**toKeyValuesArray()** - will return a flat array containing all keys and values.

**keys()** - will return all keys from query string key/value pairs as an array.

**values()** - will return all values from query string key/value pairs as an array.

**isValid()** - will return true or false depending on whether or not the query string is malformed. It does this by checking to see whether or not the query string contains an even number of key/value pairs, and if the string contains one less ampersand than there are equals signs.

**getValueFromKey()** - will return the value of the key it is passed.

**getKeyFromValue()** - will return the key of the value it is passed.

**toObject()** - will return the query string as a JavaScript object.

**append()** - will add a key/value pair to the end of the existing query string.

**updateValue()** - will change the value of a key in the query string when passed the key and the new value as parameters.

**replaceFullString()** - will replace the entire query string with a new query string when passed an array of key/value pairs.

Functions that don't return data will return true on success and false if something goes wrong or the query string is malformed. Success of all functions can be determined by checking for not false.

# Notes

Because key/value pairs are odd and even, the modulo operator is often used to perform tick/tock operations.
