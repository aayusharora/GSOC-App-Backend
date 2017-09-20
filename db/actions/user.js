/**
 * Created by aayusharora on 9/20/17.
 */

const models = require('../model');


module.exports = {

    addUserInfo : function (userData,done) {

        models.Users.create({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            college: userData.college,
            branch: userData.branch,
            isgsoc_mentor: userData.isgsoc_mentor,
            isgsoc_participant: userData.isgsoc_participant,
            github: userData.github

        }).then(function(data) {
            console.log(data);
            done(null, data)
        }).catch(function(err) {
            if (err) done(err);
        });
    }

};