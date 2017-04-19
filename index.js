'use strict';
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');
db.exec("PRAGMA foreign_keys = ON;")

/*This will include all items (models, tools, etc) including procedures*/
const CreateCatalog=`CREATE TABLE Catalog (
    CatalogID varchar(10) not null primary key
);`;

/*I want to try to create a massive table that I know will look bad,
  but with the bare minimum of stuff needed from the SharePoint site
  that can support our model validation and reporting needs. My idea
  is to have an ugly, huge table... then slice, dice, and reduce the 
  table into many smaller, normalized tables. */

const CreateLongForm=`CREATE TABLE LongForm (
    ActivityID varchar(10) not null primary key,
    ActivityName char(100) not null,
    ActivityType char(50) not null,
    ActivityRating char(10) not null,
    MVLead char(50) not null,
    ActivityDate datetime not null,
    MRMVVersion varchar(20) not null, 
    ModelClass char(10) not null,
    ERABusinessGroup varchar(20) not null,
    BusinessUnit varchar(50) not null,
    SubBusinessUnit varchar(50) not null,
    BGICR varchar(50) not null,
    Owner varchar(50) not null,
    CoOwner varchar(50) null,
    Processor varchar(50) not null,
    SOX char(1) not null,
    CCAR char(1) not null,
    PrimaryUse varchar(50) not null,
    PrimaryMethodology varchar(50) not null,
    SecondaryUse varchar(50) null,
    SecondaryMethodology varchar(5) null,
    TertiaryUse varchar(50) null,
    TertiaryMethodology varchar(50) null,
    FilePath varchar(100) not null,

    );`


//db.all(`SELECT id, skill from AssociateSkills;`, cb)
//db.run(`INSERT INTO GroupKey (AdGroup, Key, dateCreated) VALUES (?, ?, datetime('now'))`, [group, key], cb);
//db.exec(query, cb)

//this is a comment to adjust my code for an example...


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

