const passport = require('passport');
const { users } = require('../usuarios/users');
const bCrypt = require('bcrypt');

const GithubStrategy = require('passport-github2').Strategy;
// console.log(users)

function createHash(password) {
    return bCrypt.hashSync(
              password,
              bCrypt.genSaltSync(10),
              null);
  }
  

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
   }

   
const initPassport = () => {
    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/api/auth/githubcallback"
    },(accessToken, refreshToken, profile, done) => {
        //  console.log(profile)
            // console.log(accessToken)
            // console.log('login', users)
            // if (err)
            //   return done(err);
            let username = profile.username
            let user = users.find( user => user.username === username) 
    
            if (!user) {
            console.log('User Not Found with username ' + username);
            return done(null, false);
            }        
    
            // if (!isValidPassword(user, password)) {
            //   console.log('Invalid Password');
            //   return done(null, false);
            // }
    
            return done(null, user);
        })
    
    )

    
    // nos guarda el id del usuario en la session
    passport.serializeUser((user, done) => { 
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => { // toma el id que esta en las sessiones 
        console.log('usuarios Deserealizados: ',users)
        let user = users.find(user => user.id === id)
        done(null, user)
    })

}

module.exports = { initPassport }