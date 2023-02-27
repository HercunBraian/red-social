// Importar modulo de Follow
const Follow = require("../models/follow");

const followUserIds = async (userLogin) => {

    try {
        // Variable de usuarios que estoy siguiendo yo
        // Sacar informacion de seguimiento
        let following = await Follow.find({ "user": userLogin })
            .select({ "followed": 1, "_id": 0 })
            .exec()
        let followers = await Follow.find({ "followed": userLogin })
            .select({ "user": 1, "_id": 0 })
            .exec()

        // Procesar arrays de identificadores

        let followingClean = [];

        following.forEach(follow => {
            followingClean.push(follow.followed)
        })

        let followersClean = [];

        followers.forEach(follow => {
            followersClean.push(follow.user)
        })

        return {
            following: followingClean,
            followers: followersClean
        }

    } catch (error) {
        return false;
    }
}

const followThisUser = async (userLogin, profileUserId) => {
    // Sacar informacion de seguimiento
    // Comprobar si lo estoy siguiendo
    let following = await Follow.findOne({ "user": userLogin, "followed": profileUserId })
        
    // Comprobar si me esta siguiendo
    let follower = await Follow.findOne({ "user": profileUserId, "followed": userLogin })

        return {
            following,
            follower
        }
}

module.exports = {
    followUserIds,
    followThisUser
}