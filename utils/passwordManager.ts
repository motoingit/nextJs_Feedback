import bcrypt from "bcryptjs";

const salt = 10;

//salt is no of rotation
function makePassword(password: string){
  return bcrypt.hash(password, salt);
}

function comparePassword(localPass: string, remotePass: string ){
  return bcrypt.compare(localPass,remotePass )
}

export {makePassword, comparePassword};
