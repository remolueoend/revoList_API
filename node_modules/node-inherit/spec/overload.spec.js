'use strict';

describe('oo-node.overload', function(){

    var testObj = {},
        overload = require('../lib/overload');

    // overload of method 'overloadedMethod' with 2 different conditions and functions, and 1 default function:
    overload(testObj, "overloadedMethod",
        [
            function(a){ return a.length === 3 && typeof a[0] === "string" && a[1] instanceof Array; },
            function(a){ return a.length === 2 && typeof a[0] === "object" && typeof a[1] === "object"; }
        ], [
            function(stringParam, arrayParam, objParam){
                return 0;
            },
            function(objParam, objParam2){
                return 1;
            },
            // Default function:
            function(){
                return 2;
            }
        ]
    );

    // Calling overloaded function with different parameters:
    var overload_0 = testObj.overloadedMethod("foo", [1, 2, 3], true);
    var overload_01 = testObj.overloadedMethod("foo", [1, 2, 3], "baz");
    var overload_2 = testObj.overloadedMethod("foo", [1, 2, 3], "baz", 5);
    var overload_1 = testObj.overloadedMethod({}, {});
    var overload_21 = testObj.overloadedMethod({}, {}, "foo");


    it("should call overload 0 (0)", function(){
        expect(overload_0).toEqual(0);
    });
    it("should call overload 0 (01)", function(){
        expect(overload_01).toEqual(0);
    });
    it("should call overload 2 (2)", function(){
        expect(overload_2).toEqual(2);
    });
    it("should call overload 1 (1)", function(){
        expect(overload_1).toEqual(1);
    });
    it("should call overload 2 (21)", function(){
        expect(overload_21).toEqual(2);
    });
});