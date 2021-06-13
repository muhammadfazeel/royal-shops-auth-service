'use strict'

module.exports = function dbseed(db, sequelize) {
  //   // Inserting predefined data

  let user = new db.User({
    name: 'Muhammad Fazeel Aslam',
    phone: '03425495747',
    language: 'eng',
    email: 'fa.fazeel@gmail.com',
    dob: '1995-08-11',
    address: 'Kotli Azad Kashmir',
    age: 25,
    uniqueId: 'ABCDEF',
    role: 'athlete',
    isVerified: true,
    isApproved: true
  });

  user.salt = user.makeSalt()
  user.hashedPassword = user.encryptPassword('qwe123', user.salt)
  user.save()
}
