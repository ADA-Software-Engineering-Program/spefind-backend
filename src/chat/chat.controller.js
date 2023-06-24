const User = require("../auth/user.model")

const createNewChatRoom = async (req, res, next) => {
    const { user_ids } = req.body

    const existing_users = await User.find({ _id: { $in: user_ids } })
    const not_all_users_exist = existing_users.length < 2
    if (not_all_users_exist) {
        throw new 
    }
}