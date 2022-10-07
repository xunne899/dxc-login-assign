const { User} = require('../models')

//allUsers
const getAllUsers = async () => {
    const users = await User.fetchAll().map((user) => {
        return [user.get('id'), user.get('user')];
    })
  
    return users
}

//userid
const getUserById = async (userId) => {
    return await User.where({
        'id': parseInt(userId)
    }).fetch({
        require: true,
    });
}

module.exports = {
    getAllUsers,
    getUserById
}