'use strict';
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');
db.exec("PRAGMA foreign_keys = ON;")

/*This will include all items (models, tools, etc) including procedures*/
const CreateCatalog=`CREATE TABLE Catalog (
    CatalogID varchar(10) not null primary key
);`;

const CreateLongForm=`CREATE TABLE LongForm (
    ActivityID varchar(10) not null primary key,
    ActivityName char(100) not null,
    ActivityType char(50) not null,
    MVLead char(50) not null,
    ActivityDate datetime not null,
    MRMVVersion varchar(20) not null, 
    ModelClass char(10) not null,
    ERABusinessGroup varchar(20) not null,


    STOPPED HERE.
    `


//db.all(`SELECT id, skill from AssociateSkills;`, cb)
//db.run(`INSERT INTO GroupKey (AdGroup, Key, dateCreated) VALUES (?, ?, datetime('now'))`, [group, key], cb);
//db.exec(query, cb)



db.serialize(()=>{
    db.exec(CreateCatalog)
    db.exec(CreateCatalogName)
    db.exec(CreateCatalogDeterminationLookup)
    db.exec(CreateCatalogDetermination)
    db.exec(CreateCatalogRatingLookup)
    db.exec(CreateCatalogRating)
    db.exec(CreateActivitiesLookup)
    db.exec(CreateActivityID)
    CreateActivityQueries.map((val)=>{
        db.exec(val.lookup)
        db.exec(val.mainQuery)
    })
    
    db.exec(CreateIssueSeverityLookupTable)
    db.exec(CreateIssuesTable)
    db.exec(CreateIssueSeverity)
    db.exec(CreateIssueMapping)
});

module.exports.db=db

