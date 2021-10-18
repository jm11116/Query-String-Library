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
        if (this.present()){
            var keyValuesArray = this.toKeyValuesArray();
            if (keyValuesArray.includes(key)){
                var valuePos = keyValuesArray.indexOf(key) + 1;
                return keyValuesArray[valuePos];
            } else {
                return false;
            }
        }
    }
    getKeyFromValue(value){
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
    removeAll(){
        if (this.present()){
            window.history.replaceState("", "", this.parts("url"));
            return true;
        } else {
            return false;
        }
    }
    updateValue(key, new_value){
        if (this.present() && key != undefined && new_value != undefined){
            var query_string = this.parts("query");
            console.log(query_string);
            if (query_string.indexOf(key) != -1){
                var value_to_replace = this.getValueFromKey(key);
                query_string = query_string.replaceAll(value_to_replace, new_value);
                window.history.replaceState("", "", this.parts("url") + "?" + query_string);
                return true;
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