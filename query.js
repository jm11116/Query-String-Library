class QueryStringHandler {
    present(){
        if (window.location.href.indexOf("?") === -1){
            return false;
        } else {
            return true;
        }
    }
    isValid(){
        if (this.present()){
            var valid = false;
            var string = this.parts("query").toString();
            var keyValuesArray = this.toKeyValuesArray();
            var ampersands = string.split(/\&/g).length;
            var equals_signs = string.split(/\=/g).length;
            if (keyValuesArray.length === 2 && string.indexOf("=") != -1){
                valid = true;
            } else if ((keyValuesArray.length) % 2 === 0 && ampersands === (equals_signs - 1)){
                valid = true;
            }
            return valid;
        } else {
            throw "Query string not found";
        }
    }
    hasDuplicateKeys() {
        var found = false;
        if (this.present() && this.isValid()){
            this.keys().forEach((element, i) => {
                var key_array = this.keys(); //Get a fresh array of keys every iteration
                key_array.splice(i, 1); //Removes current element & checks to see if it can still be found in array
                if (key_array.includes(element)){
                    found = true;
                }
            });
            return found;
        } else {
            throw "Query string not found or is not valid";
        }
    }
    getDuplicateKeys(){
        if (this.present() && this.isValid()){
            var keys_array = this.keys();
            var test_array = [];
            var duplicates = [];
            keys_array.forEach((element) => {
                if (test_array.includes(element)){
                    duplicates.push(element);
                }
                test_array.push(element);
            });
            if (duplicates.length === 0){
                return false;
            } else {
                return duplicates;
            }
        } else {
            throw "Query string not found or is not valid";
        }
        //Each iteration pushes element in keys array to a test array and checks to see if an identical value has already been pushed there. If it has, it pushes the element to the duplicates array.
    }
    parts(part){
        if (arguments.length != 1){
            throw "Invalid arguments number: 1 required";
        }
        if (part === undefined || !["url", "query"].includes(part)){
            throw "Invalid argument";
        }
        if (!["string"].includes(typeof part)){
            throw "Invalid data type at parameter 1 (string required)";
        }
        var array = window.location.href.split("?");
        if (part === "url"){
            return array[0];
        } else if (part === "query" && this.present()){
            return array[1];
        }
    }
    toKeyValuesArray(){
        if (this.present()){
            return this.parts("query").split(/\?|\=|\&/g);
        } else {
            throw "Query string not found";
        }
    }
    keys(){
        if (this.isValid()){
            var keys_array = [];
            var keyValuesArray = this.toKeyValuesArray();
            keyValuesArray.forEach(function(element, index){
                if ((index % 2) === 0){
                    keys_array.push(element);
                }
            });
            return keys_array;
        } else {
            throw "Invalid query string";
        }
    }
    values(){
        if (this.isValid()){
            var values_array = [];
            var keyValuesArray = this.toKeyValuesArray();
            keyValuesArray.forEach(function(element, index){
                if ((index % 2) != 0){
                    values_array.push(element);
                }
            });
            return values_array;
        } else {
            throw "Invalid query string";
        }
    }
    getValueFromKey(key){
        if (arguments.length != 1){
            throw "Invalid arguments number: 1 required";
        }
        if (key === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type at parameter 1 (string or number required)";
        }
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            var values = [];
            if (keyValuesArray.includes(key)){
                keyValuesArray.forEach((element, index) => {
                    if ((index % 2) === 0 && element == key && index != keyValuesArray.length){
                        values.push(keyValuesArray[index + 1]);
                    }
                });
                if (values.length === 1){
                    return values[0];
                } else if (values.length > 1){
                    return values;
                } else {
                    return false;
                }
            } else {
                return false; //Returns false to enable function to check if key present
            }
        } else {
            throw "Query string not found";
        }
    }
    getKeyFromValue(value){
        if (arguments.length != 1){
            throw "Invalid arguments number: 1 required";
        }
        if (value === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof value)){
            throw "Invalid data type at parameter 1 (string or number required)";
        }
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            var keys = [];
            if (keyValuesArray.includes(value)){
                keyValuesArray.forEach((element, index) => {
                    if ((index % 2) != 0 && element == value){
                        keys.push(keyValuesArray[index - 1]);
                    }
                });
                if (keys.length === 1){
                    return keys[0];
                } else if (keys.length > 1) {
                    return keys;
                } else {
                    return false;
                }
            } else {
                return false; //Returns false to enable function to check if value is present at all
            }
        } else {
            throw "Query string not found.";
        }
    }
    toObject(){
        if (this.present() && this.isValid()){
            var object = {};
            var keyValuesArray = this.toKeyValuesArray();
            var current_property;
            keyValuesArray.forEach(function(element, index){
                if ((index % 2) === 0){
                    current_property = element;
                    object[element] = null;
                } else {
                    object[current_property] = element;
                }
            });
            return object;
        } else {
            throw "Query string not found or is malformed.";
        }
    }
    append(key, value){
        if (arguments.length != 2){
            throw "Invalid arguments number: 2 required";
        }
        if (key === undefined || value === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type at parameter 1 (string or number required)";
        }
        if (!["string", "number"].includes(typeof value)){
            throw "Invalid data type at parameter 2 (string or number required)";
        }
        if (this.present()){
            var existing = "?" + this.parts("query") + "&";
            var combined = existing + key + "=" + value;
            window.history.replaceState("", "", combined);
        } else {
            window.history.replaceState("", "", "?" + key + "=" + value);
        }
        return true;
    }
    removeKeyValue(key){
        if (arguments.length != 1){
            throw "Invalid arguments number: 1 required";
        }
        if (key === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type at parameter 1 (string or number required)";
        }
        if (this.present() && this.getKeyFromValue(key) != false){ //If key present
            var query_string = this.parts("query");
            var value = this.getValueFromKey(key);
            var left_ampersand = query_string.charAt(query_string.indexOf(key) - 1) === "&"; //Bool
            var right_ampersand = query_string.charAt(query_string.indexOf(value) + value.length) === "&"; //Bool
            if (this.toKeyValuesArray().length === 2){ //If key/value pair to delete is the only key/value pair
                window.history.replaceState("", "", this.parts("url"));
                return true; //Stop execution so following replaceState statement doesn't fire again
            } else if (left_ampersand === true && right_ampersand === true){
                query_string = query_string.replaceAll("&" + key + "=" + value + "&", "");
            } else if (left_ampersand === true && right_ampersand === false){
                query_string = query_string.replaceAll("&" + key + "=" + value, "");
            } else if (left_ampersand === false && right_ampersand === true){
                query_string = query_string.replaceAll(key + "=" + value + "&", "");
            }
            window.history.replaceState("", "", this.parts("url") + "?" + query_string);
            return true;
        } else {
            throw "Could not find key in query string.";
        }
    }
    removeAll(){
        window.history.replaceState("", "", window.location.href.split("?")[0]);
        return true;
    }
    updateKey(key, new_name){
        if (arguments.length != 2){
            throw "Invalid arguments number: 2 required";
        }
        if (key === undefined || new_name === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type at parameter 1 (string or number required)";
        }
        if (!["string", "number"].includes(typeof new_name)){
            throw "Invalid data type at parameter 2 (string or number required)";
        }
        if (this.present()){
            var query_string = this.parts("query");
            if (query_string.indexOf(key) != -1){
                query_string = query_string.replaceAll(key, new_name);
                window.history.replaceState("", "", this.parts("url") + "?" + query_string);
                return true;
            } else {
                return false;
            }
        } else {
            throw "Query string not found.";
        }
    }
    updateValue(key, new_value){
        if (arguments.length != 2){
            throw "Invalid arguments number: 2 required";
        }
        if (key === undefined || new_value === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type at parameter 1 (string or number required)";
        }
        if (!["string", "number"].includes(typeof new_value)){
            throw "Invalid data type at parameter 2 (string or number required)";
        }
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            keyValuesArray.forEach((element, i) => {
                if (element === key && keyValuesArray.indexOf(element) != keyValuesArray.length){
                    keyValuesArray[i + 1] = new_value; 
                }
            });
            this.replaceFullString(keyValuesArray);
            return true;
        } else {
            throw "Query string not found.";
        }
    }
    replaceFullString(keys_and_values){
        if (arguments.length != 1){
            throw "Invalid arguments number: 1 required";
        }
        if (Array.isArray(keys_and_values)){
            var arg_data_type = "array";
        } else if (typeof keys_and_values === "object"){
            var arg_data_type = "object";
        } else {
            throw "Argument must be an object or array containing key/value pairs";
        }
        if (arg_data_type === "object"){
            var temp_array = [];
            Object.keys(keys_and_values).forEach((key) => {
                temp_array.push(key);
                temp_array.push(keys_and_values[key]);
            });
            keys_and_values = temp_array;
        }
        keys_and_values.forEach((element) => { //Validate data in array
            if (typeof element === "object"){
                throw "Invalid data type in object or array: multi-level objects not allowed";
            } else if (!["string", "number"].includes(typeof element)){
                throw "Array/object contains invalid data type (only strings, numbers allowed)";
            }
        });
        var query_string = "?";
        if ((keys_and_values.length % 2) === 0){ //i.e. if even numbers, meaning valid number of key/value pairs
            keys_and_values.forEach(function(element, index){
                if ((index % 2) === 0){
                    query_string = query_string + element + "=";
                } else {
                    query_string = query_string + element + "&";
                }
            });
            query_string = query_string.substring(0, query_string.length - 1); //Removes trailing ampersand
            window.history.replaceState("", "", this.parts("url") + query_string);
            return true;
        } else {
            throw "Argument must contain an even number of key/value pairs";
        }
    }
    convertToLowerCase(){
        if (this.present()){
            window.history.replaceState("", "", this.parts("url") + "?" + this.parts("query").toLowerCase());
            return true;
        }
    }
}

var query = new QueryStringHandler();