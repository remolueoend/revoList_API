'use strict';

describe("oo-node.inherit", function(){
    var inherit = require('../lib/oo-node').inherit,
        BaseClass, SubClass;

    /**
     * Tries to create an inheritance inherit(BaseClass, SubClass);
     */
    describe("definition-syntax", function(){
        BaseClass = function(param1, param2) { this.p1 = param1; this.p2 = param2; };
        BaseClass.prototype = { method1: function(){ return this.p1 + this.p2; }};

        SubClass = function(param1, param2, param3){ BaseClass.call(this, param1, param2); this.p3 = param3; };
        SubClass.prototype = { method2: function(){ return this.p1 + this.p2 + this.p3; }};

        inherit(BaseClass, SubClass);

        runTests(SubClass);
    });

    /**
     * Tries to create an inheritance over 'inherit(BaseClass, function (..){..}, {[subClass-prototype]}'
     */
    describe("anonymous-syntax", function(){
        BaseClass = function(param1, param2) { this.p1 = param1; this.p2 = param2; };
        BaseClass.prototype = { method1: function(){ return this.p1 + this.p2; }};

        SubClass = inherit(BaseClass, function(param1, param2, param3){
            BaseClass.call(this, param1, param2); this.p3 = param3;
        }, {
            method2: function(){ return this.p1 + this.p2 + this.p3; }
        });

        runTests(SubClass);
    });

    /**
     * Runs the jasmine tests with the provided sub class function.
     * @param {function} subClass The sub class function to use for testing.
     */
    function runTests(subClass){

        var sub = new subClass(1, 2, 3);

        it("should inherit own properties", function(){
            expect(sub.p1).not.toBeUndefined();
            expect(sub.p2).not.toBeUndefined();
        });

        it("should inherit prototype members (method1)", function(){
            expect(sub.method1).not.toBeUndefined();
        });
        it("should inherit prototype members (method2)", function(){
            expect(sub.method2).not.toBeUndefined();
        });

        it("should call members in sub class' context (method1)", function(){
            expect(sub.method1()).toEqual(3);
        });
        it("should call members in sub class' context (method2)", function(){
            expect(sub.method2()).toEqual(6);
        });
    }
});

