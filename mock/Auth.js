/**
 * Author: Alvin
 * Modified By: diya
 * Created Date: 2022-04-08 17:26:58
 * Last Modified: 2022-04-22 14:12:15
 * Description:
 */
const Mock = require('mockjs')

const { Random, mock } = Mock

module.exports = {
  GET: {
    '/profiles': async (req, res) => {
      console.log('user profile request info:', req)
      const data = mock({
        'id|+1': Random.integer(1, 10000),
        name: Random.cname(),
        account: Random.string(1, 16),
        remark: Random.string(0, 50),
        roleId: Random.integer(1, 1000),
        departmentIds: Random.range(1, 3, 1),
        avatar: Random.string(32, 64),
        status: Random.boolean(1, 9, false),
        createdAt: parseInt(Random.datetime('T'), 10),
        updatedAt: parseInt(Random.datetime('T'), 10),
      })
      setTimeout(() => {
        console.log('profiles:', data)
        return res.json(data)
      }, 500)
    },
  },
  POST: {
    '/login': async (req, res) => {
      setTimeout(() => {
        const mockToken = mock({
          token: Mock.Random.string(256),
          expiredAt: parseInt(Mock.Random.datetime('T'), 10),
          refreshExpiredAt: parseInt(Mock.Random.datetime('T'), 10),
        })
        console.log('mock login data:', mockToken)
        return res.json(mockToken)
      }, 500)
    },
    '/logout': async (req, res) => {
      setTimeout(() => {
        res.status(204).send()
      }, 500)
    },
  },
  PUT: {
    '/password': async (req, res) => {
      setTimeout(() => {
        res.json({
          name: '超级管理员',
          account: '13333333333',
          avatar: 'https://test.oss.aliyuncs.com/avatar/28c02.jpg',
        })
      }, 500)
    },
  },
}
