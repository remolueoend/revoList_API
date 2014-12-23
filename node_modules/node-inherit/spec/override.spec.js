'use strict';

describe("oo-node.override", function(){
    var override = require('../lib/oo-node').override;
    var extend = require('node.extend');

    var testObj = {
        method: function (param1, param2) {
            return param1 + param2;
        }
    };

    var testObj2 = extend({}, testObj);

    override(testObj2, "method", function(original, param1, param2){
        return 2 * original(param1, param2);
    });

    it("should call the original method if not overriden", function(){
        expect(testObj.method(1, 2)).toEqual(3);
    });

    it("should call the overriden function if overriden", function(){
        expect(testObj2.method(1, 2)).toEqual(6);
    });


});
