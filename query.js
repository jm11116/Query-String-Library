class QueryStringHandler {
    constructor(){
        this.url = window.location.href;
    }
    present(){
        if (this.url.indexOf("?") === -1){
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
            throw "Query string not found.";
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
            throw "Query string not found or is not valid.";
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
            throw "Query string not found or is not valid.";
        }
        //Each iteration pushes element in keys array to a test array and checks to see if an identical value has already been pushed there. If it has, it pushes the element to the duplicates array.
    }
    parts(part){
        if (part === undefined || !["url", "query"].includes(part)){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof part)){
            throw "Invalid data type";
        }
        var array = this.url.split("?");
        if (part === "url"){
            return array[0];
        } else if (part === "query" && this.present()){
            return array[1];
        } else if (part === "query" && !this.present()){
            throw "Query string not found.";
        }
    }
    toKeyValuesArray(){
        if (this.present()){
            return this.parts("query").split(/\?|\=|\&/g);
        } else {
            throw "Query string not found.";
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
            throw "Invalid query string.";
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
            throw "Invalid query string.";
        }
    }
    getValueFromKey(key){
        if (key === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type";
        }
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            if (keyValuesArray.includes(key)){
                var valuePos = keyValuesArray.indexOf(key) + 1;
                return keyValuesArray[valuePos];
            } else {
                return false; //Returns false to enable function to check if key present
            }
        } else {
            throw "Query string not found.";
        }
        //Should return array if multiple keys of same name are present
    }
    getKeyFromValue(value){
        if (value === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof value)){
            throw "Invalid data type";
        }
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            if (keyValuesArray.includes(value)){
                var valuePos = keyValuesArray.indexOf(value) - 1;
                return keyValuesArray[valuePos];
            } else {
                throw "Value not found.";
            }
        } else {
            throw "Query string not found.";
        }
        //Should return array if multiple values of same name are present
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
        if (key === undefined || value === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type";
        }
        if (!["string", "number"].includes(typeof value)){
            throw "Invalid data type";
        }
        if (this.present() === true){
            var existing = "?" + this.parts("query") + "&";
            var combined = existing + key + "=" + value;
            window.history.replaceState("", "", combined);
        } else {
            window.history.replaceState("", "", "?" + key + "=" + value);
        }
        return true;
    }
    removeKeyValue(key){
        if (key === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type";
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
        if (key === undefined || new_name === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type";
        }
        if (!["string", "number"].includes(typeof new_name)){
            throw "Invalid data type";
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
        if (key === undefined || new_value === undefined){
            throw "Invalid argument";
        }
        if (!["string", "number"].includes(typeof key)){
            throw "Invalid data type";
        }
        if (!["string", "number"].includes(typeof new_value)){
            throw "Invalid data type";
        }
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            keyValuesArray.forEach((element, i) => {
                if (element == key && keyValuesArray.indexOf(element) != keyValuesArray.length){
                    keyValuesArray[i + 1] = new_value; 
                }
            });
            this.replaceFullString(keyValuesArray);
            return true;
        } else {
            throw "Query string not found.";
        }
    }
    replaceFullString(key_value_array){
        if (!Array.isArray(key_value_array)){
            throw "Argument must be array";
        }
        var array = key_value_array;
        var query_string = "?";
        if ((array.length % 2) === 0){ //i.e. if even numbers, meaning valid number of key/value pairs
            array.forEach(function(element, index){
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
            throw "Argument must be an even number of key/value pairs";
        }
    }
}

var query = new QueryStringHandler();