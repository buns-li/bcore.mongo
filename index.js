'use strict'

const Mongoose = require('mongoose')

const bcore = require('bcore')

const path = require('path')

const buckets = {}

bcore.on('mongo', {
    host: process.env.BCORE_MONGO_HOST || '127.0.0.1',
    port: process.env.BCORE_MONGO_PORT || 27017,
    database: process.env.BCORE_MONGO_DATABASE || 'test',
    version: 'v1'
}, function() {

    let definedSchema

    function mapSchema(modelName, schema, collectionName) {
        if (schema instanceof Mongoose.Schema) {
            buckets[modelName] = Mongoose.model(modelName, schema, collectionName)
        }
        return mapSchema
    }

    this.__init = function(options) {

        //将所有的骨架Schema定义加载,然后绑定到this作用域上

        const scope = this

        let version = options.version || 'v1'

        Mongoose.Promise = global.Promise

        let opts = {}

        if (options.user) {
            opts.user = options.user
        }
        if (options.pass) {
            opts.pass = options.pass
        }
        opts.autoReconnect = options.autoReconnect

        Mongoose.connect(options.host, options.database, options.port, opts)

        Mongoose.connection.on('error', options.errorFn || console.error.bind(console, 'connection error:'))

        //创建连接
        if (options.schemaDefineRoot) {

            definedSchema = require(path.join(options.schemaDefineRoot, version, 'index.js'))

            if (typeof definedSchema === 'function') {
                definedSchema(Mongoose.Schema, mapSchema)

                //将所有对象绑定到this作用域上,不能赋值和删除
                Object.keys(buckets)
                    .forEach(item => {
                        Object.defineProperty(scope, item, {
                            writable: false,
                            configurable: false,
                            enumerable: false,
                            value: buckets[item]
                        })
                    })
            }
        }
    }

    //提供手动生成ObjectId的方法
    this.Id = Mongoose.Types.ObjectId
})