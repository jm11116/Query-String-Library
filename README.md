# Query String Library
 A useful collection of methods to make working with URL query strings in JavaScript easy.

# Methods

**present()** - returns true or false depending on whether or not a query string is detected in the URL.

**isValid()** - will return true or false depending on whether or not the query string is malformed. It does this by checking to see whether or not the query string contains an even number of key/value pairs, and if the string contains one less ampersand than there are equals signs.

**hasDuplicateKeys()** - will search query string for duplicate keys and return true if it finds them or false if it does not.

**getDuplicateKeys()** - will return an array of duplicate keys if it can find any and false if it cannot.

**parts(*part*)** = will return either the url or the query string as a string if passed either "url" or "query" as parameters.

**toKeyValuesArray()** - will return a flat array containing all keys and values.

**keys()** - will return all keys from query string key/value pairs as an array.

**values()** - will return all values from query string key/value pairs as an array.

**getValueFromKey(*key*)** - will return the value of the key it is passed, or an array of values if multiple keys have the same value.

**getKeyFromValue(*value*)** - will return the key of the value it is passed, or an array of keys if multiple values have the same key.

**toObject()** - will return the query string as a JavaScript object.

**append(*key*, *value*)** - will add a key/value pair to the end of the existing query string.

**removeKeyValue(*key*)** - will remove a key and its value when passed a valid key as a parameter.

**updateKey(*key*, *new_name*)** - will change the name of all matching keys in the query string when passed the keys' existing name and their new name as arguments.

**updateValue(*key*, *new_value*)** - will change the value of all matching keys in the query string when passed the key and the new value as parameters.

**replaceFullString(*keys_and_values*)** - will replace the entire query string when passed an array or object containing key/value pairs.

**convertToLowerCase()** - will make the entire query string lowercase.

Functions that don't return data will return true on success and false if something goes wrong or the query string is malformed. Success of all functions can be determined by checking for not false.

# Notes

Because key/value pairs are odd and even, the modulo operator is often used to perform tick/tock operations.
