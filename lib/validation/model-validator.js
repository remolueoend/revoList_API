/**
 * Created by remo on 16/10/14.
 */

'use strict';

function validateType(def, val){
    return def.type == null || typeof val === def.type;
}

function validateMin(def, val){
    return def.min == null ||
        (typeof val === "number" && val >= def.min) ||
        typeof val.length === "undefined" ||
        val.length >= def.min;
}

function validateMax(def, val){
    return def.max == null ||
        (typeof val === "number" && val <= def.max) ||
        typeof val.length === "undefined" ||
        val.length <= ded.max;
}

function validateRegex(def, val){
    return def.regex == null || def.regex.test(val);
}

function validateRequired(def, val){
    return !def.required || val != null;
}

/**
 * Provides validation for model objects.
 * @param {object} entity The model object to validate
 * @param {object} definition The model definition to use for validation.
 * @param {ModelState} modelState
 * @constructor
 */
function Validator(entity, definition, modelState){
    this.entity = entity;
    this.definition = definition;
    this.modelState = modelState;
}
Validator.prototype = {

    /**
     * Validates the model.
     */
    validate: function(){
        var entity = this.entity,
            definition = this.definition;

        for(var d in definition) {
            if (definition.hasOwnProperty(d)) {
                var def = definition[d],
                    val = entity[d];

                if(val != null){

                    // type
                    if (!validateType(def, val)) {
                        this.push(d, d + ' must be of type ' + def.type);
                    }

                    // max
                    if(!validateMax(def, val)){
                        if (typeof val === "number") {
                            this.push(d, d + " must be smaller than " + def.max);
                        } else {
                            this.push(d, d + " must be shorter than " + def.max + " characters");
                        }
                    }

                    // min
                    if (!validateMin(def, val)) {
                        if (typeof val === "number") {
                            this.push(d, d + " must be greater than " + def.min);
                        } else {
                            this.push(d, d + " must be longer than " + def.min + " characters");
                        }
                    }

                    // regex
                    if (!validateRegex(def, val)) {
                        this.push(d, d + " is invalid");
                    }
                }
            }

            // required
            if(!validateRequired(def, val)){
                this.push(d, 'is required');
            }
        }
    },

    /**
     * Pushes a new validation error to the error collection
     * @param {string} prop The name of the property
     * @param {string} msg The validation message
     */
    push: function(prop, msg){
        this.modelState.addError(prop, msg);
    }
};

module.exports = Validator;