/**
 * Created by remo on 06/10/14.
 */

'use strict';

/**
 * Provides an object containing global constants
 * @type {{}}
 */
module.exports = {
    /**
     * Name of URL param containing the ID: /:entityParamName/:idParamName
     */
    idParamName: "id",

    /**
     * Name of URL param containing the entity: /:entityParamName/:idParamName
     */
    entityParamName: "entity",

    /**
     * Name of URL param containing the action: /:entityParamName/:actionParamName/:idParamName
     */
    actionParamName: 'action',

    /**
     * Contains constants used for db connections and mutations
     */
    db: (function(){
        var host = "localhost",
            port = 27017,
            dbName = "revoList_dev_01";

        return {
            /**
             * Returns the connection string which can be used for monk modules.
             */
            getConnectionString: function(){
                return host + ":" + port + "/" + dbName;
            }
        }
    })()
};