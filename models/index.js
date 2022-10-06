const bookshelf = require("../bookshelf")


// creates a relationship between roles and user
const User = bookshelf.model("User",{
    tableName:"users",
    role: function(){
        return this.belongsTo('Role')
    },
})



module.exports = {
    User
};