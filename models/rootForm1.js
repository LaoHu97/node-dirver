var moviesSurfaceR={
  addSurfaceForm:'INSERT INTO `moviesSurfaceR` (`id`,`title`,`profiles`,`imageUrl`,`times`,`videoUrl`,`videoUrlPass`,`addr`,`domains`,`average`,`data`) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
  RestrictedID: 'select * from moviesSurfaceR where id=?',
  // moviesType: 'select * from videoInsert where type=?',
  // addImages:'UPDATE videoInsert SET type = ?,topImg = ? WHERE id = ?',
  // statusImages:'UPDATE videoInsert SET type = ? WHERE id = ?',
  // updateResources:'UPDATE videoInsert SET videoUrl = ?,videoUrlPass = ? WHERE id = ?'
}

module.exports=moviesSurfaceR;
