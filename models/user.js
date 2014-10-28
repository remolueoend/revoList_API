/**
 * Created by remo on 16/10/14.
 */

'use strict';

module.exports = {
    firstName: {
        required: true,
        type: "string",
        min: 3
    },
    lastName: {
        required: true,
        type: "string",
        min: 3
    },
    mail: {
        regex: new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$", "i")
    }
};