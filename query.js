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
        if (this.present()){
            this.keys().forEach((element, i) => {
                var key_array = this.keys(); //Get a fresh array of keys
                key_array.splice(i, 1); //Removes current element and then searches for it
                if (key_array.includes(element)){
                    found = true;
                }
            });
            return found;
        } else {
            throw "Query string not found.";
        }
    }
    parts(part){
        if (this.present()){
            var array = this.url.split("?");
            if (part === "url"){
                return array[0];
            } else if (part === "query"){
                return array[1];
            }
        } else {
            return false;
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
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            if (keyValuesArray.includes(key)){
                var valuePos = keyValuesArray.indexOf(key) + 1;
                return keyValuesArray[valuePos];
            } else {
                throw "Key not found.";
            }
        }
        //Should return array if multiple keys of same name are present
    }
    getKeyFromValue(value){
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            if (keyValuesArray.includes(value)){
                var valuePos = keyValuesArray.indexOf(value) - 1;
                return keyValuesArray[valuePos];
            } else {
                throw "Value not found.";
            }
        } else {
            return false;
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
        var existing = "?" + this.parts("query") + "&";
        var combined = existing + key + "=" + value;
        if (this.present() === true){
            window.history.replaceState("", "", combined);
        } else {
            window.history.replaceState("", "", "?" + key + "=" + value);
        }
        return true;
    }
    removeKeyValue(key){
        if (this.present() && this.getKeyFromValue(key) != false){
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
            return false;
        }
    }
    removeAll(){
        if (this.present()){
            window.history.replaceState("", "", this.parts("url"));
            return true;
        } else {
            return false;
        }
    }
    updateKey(key, new_name){
        if (this.present() && key != undefined && new_name != undefined){
            var query_string = this.parts("query");
            if (query_string.indexOf(key) != -1){
                query_string = query_string.replaceAll(key, new_name);
                window.history.replaceState("", "", this.parts("url") + "?" + query_string);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    updateValue(key, new_value){
        if (this.present() && key != undefined && new_value != undefined){
            var query_string = this.parts("query");
            if (query_string.indexOf(key) != -1){ //If key present in string
                var value_to_replace = this.getValueFromKey(key);
                query_string = query_string.replaceAll(value_to_replace, new_value);
                window.history.replaceState("", "", this.parts("url") + "?" + query_string);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    replaceFullString(key_value_array){
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
            return false;
        }
    }
}

var query = new QueryStringHandler();