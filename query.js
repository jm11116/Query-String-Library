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
            if (keyValuesArray.length === 2){
                valid = true;
            } else if ((keyValuesArray.length) % 2 === 0 && ampersands === (equals_signs - 1)){
                valid = true;
            }
            return valid;
        } else {
            return false;
        }
    }
    parts(part){
        if (part != "url" || part != "query"){
            throw "Invalid argument. Please specify url part."
        }
        if (typeof part != "string" || typeof part != "number") {
            throw "Invalid argument: string or integer required.";
        }
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
            return false;
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
            return false;
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
            return false;
        }
    }
    getValueFromKey(key){
        if (key === undefined || key === null){
            throw "Argument required (key).";
        }
        if (typeof key != "string" || typeof key != "number") {
            throw "Invalid argument: string or integer required.";
        }
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            if (keyValuesArray.includes(key)){
                var valuePos = keyValuesArray.indexOf(key) + 1;
                return keyValuesArray[valuePos];
            } else {
                return false;
            }
        } else {
            return false;
        }
        //Should return array if multiple keys of same name are present
    }
    getKeyFromValue(value){
        if (key === undefined || key === null){
            throw "Argument required (value).";
        }
        if (typeof value != "string" || typeof value != "number") {
            throw "Invalid argument: string or integer required.";
        }
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            if (keyValuesArray.includes(value)){
                var valuePos = keyValuesArray.indexOf(value) - 1;
                return keyValuesArray[valuePos];
            } else {
                return false;
            }
        } else {
            return false;
        }
        //Should return array if multiple values of same name are present
    }
    toObject(){
        if (this.present()){
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
            return false;
        }
    }
    append(key, value){
        if (key === undefined || key === null || value === undefined || value === null){
            throw "Invalid arguments: key, value required.";
        }
        if (typeof key != "string" || typeof key != "number") {
            throw "Invalid argument: string or integer required.";
        }
        if (typeof value != "string" || typeof value != "number") {
            throw "Invalid argument: string or integer required.";
        }
        if (this.present()){
            var existing = "?" + this.parts("query") + "&";
            var combined = existing + key + "=" + value;
            if (this.present() === true){
                window.history.replaceState("", "", combined);
            } else {
                window.history.replaceState("", "", "?" + key + "=" + value);
            }
            return true;
        } else {
            window.history.replaceState("", "", "?" + key + "=" + value);
            return true;
        }
    }
    removeKeyValue(key){
        if (key === undefined || key === null){
            throw "Key required.";
        }
        if (typeof key != "string" || typeof key != "number") {
            throw "Invalid argument, string or integer required.";
        }
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
        if (key === undefined || key === null || new_name === undefined || new_name === null){
            throw "Invalid arguments: key, new_name required.";
        }
        if (typeof key != "string" || typeof key != "number") {
            throw "Invalid argument: string or integer required.";
        }
        if (typeof new_name != "string" || typeof new_name != "number") {
            throw "Invalid argument: string or integer required.";
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
            return false;
        }
    }
    updateValue(key, new_value){
        if (key === undefined || key === null || new_value === undefined || new_value === null){
            throw "Invalid arguments: key, new_value required.";
        }
        if (typeof key != "string" || typeof key != "number") {
            throw "Invalid argument: string or integer required.";
        }
        if (typeof new_value != "string" || typeof new_value != "number") {
            throw "Invalid argument: string or integer required.";
        }
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
        if (key_value_array === undefined || key_value_array === null){
            throw "Invalid argument: key value array required.";
        }
        if (!Array.isArray(key_value_array)){
            throw "Argument is not an array.";
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
            throw "Invalid key/value pair given.";
        }
    }
}

var query = new QueryStringHandler();

query.parts();