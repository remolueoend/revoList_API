'use strict';

/**
 * Provides function overloading.
 * Each provided overload has a condition function, which gets called with the
 * original provided arguments and returns true, if the overload with the same index
 * should be used. If no provided condition is true, a last default overload function without condition
 * can be provided which gets called at least.
 * @param {any} context The context to which the overloaded function should be appended to.
 * @param {string} name The name of the function to overload.
 * @param {array} conditions Condition functions which return true if the function with the same index
 * should be called.
 * @param {array} functions An array of function overloads.
 *
 * @example
 * function TestClass(){ }
 * overload(TestClass.prototype, "overloadedMethod", [
 *     function(){ arguments.length === 3 && arguments[0] === string },    // condition for overload function 1
 *     function(){ arguments[0] === string },                              // condition for overload function 2
 * ], [
 *     function(a, b, c){ .. Code of overload function 1 .. },
 *     function(a, b){ .. Code of overload function 2 .. },
 *     function(){ .. Code of overload function 3 .. },                    // default function without condition
 * ]);
 *
 * var inst = new TestClass();
 * inst.overloadedMethod("foo", 3, true);  // Calls overload 1
 * inst.overloadedMethod("foo" "baz");     // Calls overload 2
 * inst.overloadedMethod(42);              // Calls overload 3
 *
 */
function overload(context, name, conditions, functions){
    context[name] = function () {
        var cc;
        for (cc = 0; cc < conditions.length; cc++) {
            if (conditions[cc].call(context, Array.prototype.slice.call(arguments, 0))) {
                if (typeof functions[cc] === "function") {
                    return functions[cc].apply(context, arguments);
                }
            }
        }

        // Call optional default function without a condition:
        if (typeof functions[cc] !== "undefined") {
            return functions[cc].apply(context, arguments);
        }

        // No matching overload found => throw an excpetion
        throw new Error("oo-node.overload[" + name + "]: No matching overload could be found");
    };
}

module.exports = overload;
