'use strict';
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');



//db.all(`SELECT id, skill from AssociateSkills;`, cb)
//db.run(`INSERT INTO GroupKey (AdGroup, Key, dateCreated) VALUES (?, ?, datetime('now'))`, [group, key], cb);
//db.exec(query, cb)



db.serialize(()=>{
    //db.exec(query, cb)
});

module.exports.db=db
