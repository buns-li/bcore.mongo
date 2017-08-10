'use strict'

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test')

mongoose.Promise = global.Promise

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log("we're connected!")
})

let Schema = mongoose.Schema

let AppVersionSchema = new mongoose.Schema({
    //应用id
    appid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    /**
     * 是否当前正在应用的主版本
     * @type {Object}
     */
    isMain: {
        type: Boolean,
        default: false
    },
    //创建时间
    time: {
        type: Number,
        required: true
    },
    /**
     * 应用状态
     */
    state: {
        type: Number,
        required: true
    },
    //版本号
    no: {
        type: String,
        required: true
    },
    //上一个版本号
    prev: {
        type: String
    },
    //包含的模块
    //{{'id':'','state', 0未变动1改动2禁用3新增'ref':''//原始模板}}
    m: {
        type: [

            {
                id: Schema.Types.ObjectId,
                ref: Schema.Types.ObjectId,
                refv: String,
                state: Number
            }
        ],
        required: true
    },
    //包含的业务线
    //{{'moduleId':moduleid,'state','ref':''//原始模板}}
    l: {
        type: [

            {
                id: Schema.Types.ObjectId,
                ref: Schema.Types.ObjectId,
                refv: String,
                state: Number
            }
        ],
        required: true
    },
    //包含的业务点
    //{{'lineId':'nodeId','state','ref':''//原始模板}}
    n: {
        type: [

            {
                id: Schema.Types.ObjectId,
                ref: Schema.Types.ObjectId,
                refv: String,
                state: Number
            }
        ],
        required: true
    }
})

let appVersionModel = mongoose.model('appVersion', AppVersionSchema)

// appVersionModel
//     .create({
//         appid: mongoose.Types.ObjectId(),
//         isMain: true,
//         time: 20170806100000,
//         state: 6,
//         no: 'v4',
//         prev: 'v3',
//         m: [{
//             id: mongoose.Types.ObjectId(),
//             ref: mongoose.Types.ObjectId(),
//             refv: 'v3',
//             state: 1
//         }],
//         l: [{
//             id: mongoose.Types.ObjectId(),
//             ref: mongoose.Types.ObjectId(),
//             refv: 'v3',
//             state: 1
//         }],
//         n: [{
//             id: mongoose.Types.ObjectId(),
//             ref: mongoose.Types.ObjectId(),
//             refv: 'v3',
//             state: 1
//         }]
//     })
//     .then(inserted => {
//         console.log('inserted', inserted)
//         return appVersionModel.find().lean().then(data => console.log('data:', data))
//     })

// appVersionModel.update({ time: 20170806100000, m: { $elemMatch: { refv: 'v1' } } }, {
//     $set: { 'm.$.state': 2 }
// }).then(rslt => console.log(rslt))

appVersionModel.update({ time: 20170806100000, m: { $elemMatch: { refv: 'v1' } } }, {
    $pull: {
        m: {
            refv: 'v1'
        }
    }
}).then(rslt => console.log(rslt))

// let UserSchema = mongoose.Schema({
//     //用户标识
//     userid: mongoose.Schema.Types.ObjectId,
//     //身份类型（0-账号、1-手机、2-邮箱、第三方授权方名称 3-wechat、4-qq、5-sina-weibo、6-tencent-weibo、7-github、8-coding、9-google
//     identify_type: {
//         type: Number,
//         min: 0,
//         max: 10
//     },
//     //登录身份(账号、手机号、邮箱号、wechat.openid、qq.openid、sina-weibo.openid、tencent-weibo.openid、github.openid、coding.openid、google.openid)
//     identifier: String,
//     //登录凭证(站内登录的话则是密码,第三方的存储access_token值)
//     credential: String,
//     //是否验证，如果是第三方则默认成功, 如果是没有做手机和邮箱验证的则为false,
//     //如果第三方取消绑定了,则此值会变为false
//     verified: {
//         type: Boolean,
//         required: true
//     },
//     //ip地址
//     ip: {
//         type: mongoose.Schema.Types.Mixed
//     },
//     //授权时间
//     time: Number,
//     //附件信息,第三方登录所携带的其他信息
//     attach: mongoose.Schema.Types.Mixed,
//     token: String
// })



// let userModel = mongoose.model('UserOAuth', UserSchema)


// async function test() {

//     let inserted = await userModel.create({
//         userid: mongoose.Types.ObjectId(),
//         identify_type: 0,
//         identifier: 'buns',
//         credential: '123456',
//         verified: true
//     }).catch(err => {
//         console.log(err)
//         return null
//     })

//     console.log('inserted:', inserted)

//     let result = await userModel.findOne({
//             identifier: 'buns',
//             credential: '123456'
//         })
//         .select('userid verified')
//         .lean()
//         .catch(err => console.log(err))

//     console.log('result:', result)

//     let updated = await userModel.updateOne({
//         userid: result.userid,
//         identifier: 'buns'
//     }, {
//         token: 'random test data'
//     })

//     console.log('updated:', updated)
// }

// test()


// userModel.insertMany([{
//     _id: 1,
//     nickname: 'buns.li',
//     mobile: '15021431294'
// }, {
//     _id: 2,
//     nickname: 'buns.zpli',
//     mobile: '15021431294',
//     email: 'zpli_buns@126.com'
// }], (err, data) => {
//     console.log(err, data, data[0].id)
// })

// userModel.deleteMany({
//         mobile: '15021431294'
//     })
//     .then(data => {
//         console.log(data)
//     })
//     .catch(err => {
//         console.log('err:', err)
//     })