const bookshelf = require("../bookshelf")


// creates a relationship between roles and user
const User = bookshelf.model("User",{
    tableName:"users",
    role: function(){
        return this.belongsTo('Role')
    },
})


// creates a relationship between roles and user
// const Role = bookshelf.model('Role' , {
//     tableName: 'roles',
//     accounts: function(){
//         return this.hasMany('User')
//     }
// })

module.exports = {
    User
};