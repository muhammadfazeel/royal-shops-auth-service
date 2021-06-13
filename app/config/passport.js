'use strict'

const passport = require('passport')
const config = require('./environment.config') 
const passportJWT = require('passport-jwt')
const _ = require('lodash')

// Handling passport strategy
let ExtractJwt = passportJWT.ExtractJwt
let JwtStrategy = passportJWT.Strategy

let newConfig = {
  jwtOptions: {
    'secretOrKey': process.env.secretOrKey || config.jwtOptions.secretOrKey,
    'ignoreExpiration': process.env.ignoreExpiration || config.jwtOptions.ignoreExpiration,
    'passReqToCallback': process.env.passReqToCallback || config.jwtOptions.passReqToCallback
  }
}

newConfig.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

var strategy = new JwtStrategy(newConfig.jwtOptions, (req, jwtPayload, next) => {
  if (!_.isEmpty(jwtPayload.data)) {
    jwtPayload = jwtPayload.data
  }
  next(null, jwtPayload)
})

passport.use(strategy)

module.exports = passport
