'use strict';
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');
db.exec("PRAGMA foreign_keys = ON;")

/*This will include all items (models, tools, etc) including procedures*/
const CreateCatalog=`CREATE TABLE Catalog (
    CatalogID varchar(10) not null primary key
);`;

const CreateCatalogName=`CREATE TABLE CatalogName (
     CatalogID varchar(10) not null,
     Name varchar(50) not null, 
     DateModified datetime not null, 
     Constraint pkCatalogName PRIMARY KEY(CatalogID, Name), 
     Constraint fkCatalogNameToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID)
);`;

const CreateCatalogDeterminationLookup=`CREATE TABLE CatalogDeterminationLookup (
    DeterminationType varchar(30) not null primary key
);`
const CreateCatalogDetermination=`CREATE TABLE CatalogDetermination (
    CatalogID varchar(10) not null,
    DeterminationType varchar(10) not null,
    DateModified datetime not null,
    CONSTRAINT pkCatalogDetermination PRIMARY KEY(CatalogID, DeterminationType, DateModified),
    CONSTRAINT fkCatalogDeterminationToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID),
    CONSTRAINT fkCatalogDeterminationToLookup FOREIGN KEY(DeterminationType) REFERENCES CatalogDeterminationLookup(DeterminationType)
)
`

const CreateCatalogRatingLookup=`CREATE TABLE CatalogRatingLookup (
    Rating varchar(30) not null primary key
);`
const CreateCatalogRating=`CREATE TABLE CatalogRating (
    CatalogID varchar(10) not null,
    Rating varchar(10) not null,
    DateModified datetime not null,
    CONSTRAINT pkCatalogRating PRIMARY KEY(CatalogID, Rating, DateModified),
    CONSTRAINT fkCatalogRatingToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID),
    CONSTRAINT fkCatalogRatingToLookup FOREIGN KEY(Rating) REFERENCES CatalogRatingLookup(Rating)
)
`


/**Annual review, validation, significant change, 
 * OGM, determinations */
const CreateActivitiesLookup=`CREATE TABLE ActivityLookup(
    ActivityType varchar(50) not null primary key
);`;

const CreateActivityID=`
CREATE TABLE Activity(
    ActivityID INTEGER PRIMARY KEY AUTOINCREMENT,
    ActivityType varchar(50) not null,
    CatalogID,
    CONSTRAINT fkActivityType FOREIGN KEY(ActivityType) REFERENCES ActivityLookup(ActivityType)
);
`

const ActivityTypes=[
    "Validation", 
    "AnnualReview",
    "Exam",
    "Determination",
    "SignificantChange",
    "OGM",
    "IssueRemediation"
]


/**What is an action? */

/**Each activity will have its own table (actions) so that 
 * each activity will have its own set of actions
 */
const CreateActivityQueries=ActivityTypes.map((val)=>{
    return {
        lookup:`
            CREATE TABLE ${val}ActionLookup(
                Action varchar(30) not null primary key
            );
            `,
        mainQuery:`
            CREATE TABLE ${val}Action(
                ActivityID INTEGER NOt null,
                Action varchar(30) not null,
                DateModified datetime not null,
                CONSTRAINT pk${val}Action PRIMARY KEY(ActivityID, Action),
                CONSTRAINT fk${val}Action FOREIGN KEY(Action) REFERENCES
                    ${val}ActionLookup(Action)
            );
        `
    }
})


/*Issues severity lookup*/
const CreateIssueSeverityLookupTable=`
CREATE TABLE IssueSeverityLookup(
    IssueSeverity varchar(30) not null primary key
);`

/* Issues table*/
const CreateIssuesTable=`
CREATE TABLE Issues(
    IssueID Integer not null primary key,
    ActivityID INTEGER not null,
    CONSTRAINT fkIssueActivity FOREIGN KEY(ActivityID) REFERENCES Activity(ActivityID)
);`

/**issues severity table (for downgrades/upgrades) */
const CreateIssueSeverity=`
CREATE TABLE IssueSeverity(
    IssueID Integer not null,
    IssueSeverity varchar(30) not null,
    DateModified datetime not null,
    CONSTRAINT pkIssueSeverity PRIMARY KEY(IssueID, IssueSeverity, DateModified),
    CONSTRAINT fkIssueSeverityToIssueID FOREIGN KEY(IssueID) REFERENCES Issues(IssueID),
    CONSTRAINT fkISsueSeverirtyToLookup FOREIGN KEY(IssueSeverity) REFERENCES IssueSeverityLookup(IssueSeverity)
)
`

/**Issue mapping table (for recasts) */
const CreateIssueMapping=`
CREATE TABLE IssueMapping(
    PriorIssueID Integer not null, 
    RecastIssueID INteger not null,
    Constraint pkIssueMapping PRIMARY KEY(PriorIssueID, RecastIssueID),
    Constraint fkPriorIssue FOREIGN KEY(PriorIssueID) REFERENCES Issues(ISsueID),
    Constraint fkRecastIssue FOREIGN KEY(RecastIssueID) REFERENCES Issues(ISsueID)
)
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

