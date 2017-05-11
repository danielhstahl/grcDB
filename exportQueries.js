/*This will include all items (models, tools, etc) including procedures*/
const CreateCatalog=`CREATE TABLE Catalog (
    CatalogID integer not null primary key
);`;

/**catalog events include development date, implementation date, retirement date.  
 * "status" will be configured by these dates.  eg, "active" will be where implementation date exists but retirement doesn't
  */
 const CreateCatalogEventLookup=`
CREATE TABLE CatalogEventLookup (
    CatalogEvent varchar(30) not null primary key    
);`
/** */
 const CreateCatalogEvent=`
CREATE TABLE CatalogEvents (
    CatalogID integer not null,
    DateOfEvent date not null,
    DateModified datetime not null,
    CatalogEvent varchar(30) not null,
    constraint pkCatalogEvents PRIMARY KEY(CatalogId, DateOfEvent, CatalogEvent),
    Constraint fkCatalogEventsToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID),
    Constraint fkCatalogEventsToCatalogLookup FOREIGN KEY(CatalogEvent) REFERENCES CatalogEventLookup(CatalogEvent)
);
`

/**hiccups include "not ready for validation" */
 const CreateCatalogHiccupsLookup=`
CREATE TABLE HiccupsLookup (
    Hiccup varchar(50) not null Primary Key
);`

/**Waiver type includes the type of waiver...but 
 * I think it should be done by hiccup so this table is going away */
/*const CreateCatalogWaiverLookup=`
CREATE TABLE CatalogWaiverLookup(
    WaiverType varchar(20) not null primary key
)`*/
 const CreateCatalogWaiver=`
CREATE TAble CatalogWaiver(
    WaiverID integer not null,
    CatalogId integer not null, 
    Hiccup varchar(50) not null,
    DateModified datetime not null, 
    Constraint pkCatalogWaiver PRIMARY KEY(WaiverID),
    Constraint fkWaiverToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID),
    Constraint fkHiccupstoLookup FOREIGN KEY(Hiccup) REFERENCES CatalogHiccupsLookup(Hiccup)
);
`
 const CreateCatalogWaiverDueDates=`
CREATE TABLE CatalogWaiverDue(
    WaiverID integer not null, 
    DueDate date not null,
    DateModified datetime not null,
    CONSTRAINT pkWaiverDue PRIMARY KEY(WaiverID, DueDate),
    CONSTRAINT fkWaiverDueToWaiver FOREIGN KEY(WaiverID) REFERENCES CatalogWaiver(WaiverID)
);
`

 const CreateCatalogOngoingMonitoringResults=`
CREATE TABLE OngoingMonitoringResults (
    CatalogID integer not null,
    OGMDate date not null,
    DateModified datetime not null,
    Expected Decimal(10, 2) not null,
    Actual Decimal(10, 2) not null,
    CONSTRAINT pkcID PRIMARY KEY (CatalogId, OGMDate, DateModified),
    CONSTRAINT fkOGM FOREIGN KEY(CatalogId) REFERENCES Catalog(CatalogID)
)
`
 const CreateCatalogOngoingMonitoringProgram=`
CREATE TABLE OngoingMonitoringProgram (
    CatalogID integer not null,
    DateModified datetime not null,
    Threshold Decimal(10, 2) not null,
    CONSTRAINT pkOGMP PRIMARY KEY (CatalogId,  DateModified),
    CONSTRAINT fkOGMCatalog FOREIGN KEY(CatalogId) REFERENCES Catalog(CatalogID)
)
`


/**the "owner" field will be verified against AD.  
 * All other fields (eg, business group, etc) will be populated by AD  */
 const CreateCatalogOwner=`
CREATE TABLE CatalogOwner (
    CatalogId integer not null,
    DateModified datetime not null,
    Owner integer not null,
    Constraint pkCatalogOwner PRIMARY KEY(CatalogID, DateModified, Owner),
    Constraint fkCatalogOwnerToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID)
)
`

/**track upstream and downstream models */
 const CreateCatalogPrecedence=`
CREATE TABLE CatalogDependencies (
    UpstreamCatalogId integer not null,
    DownstreamCatalogId integer not null,
    CONSTRAINT pkCatalogDependencies PRIMARY KEY(UpstreamCatalogId, DownstreamCatalogId),
    CONSTRAINT fkUpstream FOREIGN KEY(UpstreamCatalogId) REFERENCES Catalog(CatalogID),
    CONSTRAINT fkDownstream FOREIGN KEY(DownstreamCatalogId) REFERENCES Catalog(CatalogID)
);`


 const CreateCatalogCategoriesLookup=`
CREATE TABLE CatalogCategoriesLookup (
    Category varchar(20) not null primary key
);`
/**eg, for CCAR/SOX etc *
 *  Use that is no longer applicable 
 * has a new entry with Applicable=false*/
 const CreateCatalogCategories=`
CREATE TABLE CatalogCategories (
    CatalogId integer not null,
    Category varchar(20) not null,
    Applicable boolean not null,
    DateModified datetime not null,
    CONSTRAINT pkCatalogCategories PRIMARY KEY(CatalogID, Category, Applicable, DateModified),
    CONSTRAINT fkCatalogCategoriesToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID),
    CONSTRAINT fkCatalogCategoriesLookup FOREIGN KEY(Category) REFERENCES CatalogCategoriesLookup(Category)
);`

 const CreateCatalogName=`CREATE TABLE CatalogName (
     CatalogID integer not null,
     Name varchar(50) not null, 
     DateModified datetime not null, 
     Constraint pkCatalogName PRIMARY KEY(CatalogID, Name), 
     Constraint fkCatalogNameToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID)
);`

 const CreateCatalogDeterminationLookup=`CREATE TABLE CatalogDeterminationLookup (
    DeterminationType varchar(30) not null primary key
);`
 const CreateCatalogDetermination=`CREATE TABLE CatalogDetermination (
    CatalogID integer not null,
    DeterminationType integer not null,
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
    CatalogID integer not null,
    Rating integer not null,
    DateModified datetime not null,
    CONSTRAINT pkCatalogRating PRIMARY KEY(CatalogID, Rating, DateModified),
    CONSTRAINT fkCatalogRatingToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID),
    CONSTRAINT fkCatalogRatingToLookup FOREIGN KEY(Rating) REFERENCES CatalogRatingLookup(Rating)
)
`
/**analyst and lead will be verified against AD.  
 * Lead can be automatically entered by using the 
 * id of the person submitting the form */
 const CreateCatalogMRMV=`CREATE TABLE CatalogAssignment (
    CatalogID integer not null,
    Analyst integer not null,
    Lead integer not null,
    DateModified datetime not null,
    CONSTRAINT pkCatalogAssignment PRIMARY KEY(CatalogID, Analyst, Lead, DateModified),
    CONSTRAINT fkAssignmentToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID)
)`
/**Use is the description of what the model is used for.
 * Use that is no longer applicable 
 * has a new entry with Applicable=false.
 */
 const CreateCatalogUses=`CREATE TABLE CatalogUses (
    CatalogID integer not null,
    Use varchar(50) not null,
    DateModified datetime not null,
    Applicable boolean not null,
    CONSTRAINT pkCatalogUses PRIMARY KEY(CatalogID, Use, Applicable, DateModified),
    CONSTRAINT fkCatalogUsesToCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID)
);`

/**Annual review, validation, significant change, 
 * OGM, determinations */
 const CreateActivitiesLookup=`CREATE TABLE ActivityLookup(
    ActivityType varchar(50) not null primary key
);`;

 const CreateActivityID=`
CREATE TABLE Activity(
    ActivityID INTEGER PRIMARY KEY,
    ActivityType varchar(50) not null,
    CatalogID integer not null,
    CONSTRAINT fkActivityType FOREIGN KEY(ActivityType) REFERENCES ActivityLookup(ActivityType),
    CONSTRAINT fkActivityCatalog FOREIGN KEY(CatalogID) REFERENCES Catalog(CatalogID)
);
`

 const CreateActivityAnalysts=`

    CREATE TABLE ActivityUsers(
        ActivityID INTEGER NOt null,
        Analyst integer,
        DateModified datetime not null, 
        Applicable BIT not null,
        CONSTRAINT pkActivityAnalysts PRIMARY KEY(ActivityID, Analyst, DateModified, Applicable),
        CONSTRAINT fkCatalogAnalystsToActivity FOREIGN KEY(ActivityID) REFERENCES Activity(ActivityID)
    )

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


/**What is an action? 
 * I think an action is like "start", "draft published", "validation readiness assessment"
 * ...should it include QC checkpoints?
 * should it include items required for a validation like "scoping", "skills assessment"?*/

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
    CONSTRAINT fkIssueSeverityToLookup FOREIGN KEY(IssueSeverity) REFERENCES IssueSeverityLookup(IssueSeverity)
);
`

/**Issue Events include "issue date", "remediation submitted", "closed date" */
 const CreateIssueEventsLookup=`
CREATE TABLE IssueEventsLookup (
    Event varchar(20) not null primary key
);`

 const CreateIssueEvents=`
CREATE TABLE IssueEvents(
    IssueID Integer not null,
    Event varchar(20) not null,
    DateModified datetime not null,
    CONSTRAINT pkIssueEvent PRIMARY KEY(IssueID, Event, DateModified),
    CONSTRAINT fkEventToIssue FOREIGN KEY(IssueID) REFERENCES Issues(ISsueID),
    CONSTRAINT fkEventLookup FOREIGN KEY(Event) REFERENCES IssueEventsLookup(Event)
);`

/**When issues are due */
 const CreateIssueDueDates=`
CREATE TABLE IssueDueDates (
    IssueID integer not null,
    DueDate date not null,
    DateModified datetime not null,
    CONSTRAINT pkIssueDueDate PRIMARY KEY(IssueID, DueDate, DateModified),
    CONSTRAINT fkIssueDueToIssues FOREIGN KEY(IssueID) REFERENCES Issues(IssueID)
);`

/**Issue mapping table (for recasts) */
 const CreateIssueMapping=`
CREATE TABLE IssueMapping(
    PriorIssueID Integer not null, 
    RecastIssueID Integer not null,
    Constraint pkIssueMapping PRIMARY KEY(PriorIssueID, RecastIssueID),
    Constraint fkPriorIssue FOREIGN KEY(PriorIssueID) REFERENCES Issues(IssueID),
    Constraint fkRecastIssue FOREIGN KEY(RecastIssueID) REFERENCES Issues(IssueID)
);
`

module.exports.CreateCatalog=CreateCatalog;
module.exports.CreateCatalogEventLookup=CreateCatalogEventLookup;
module.exports.CreateCatalogEvent=CreateCatalogEvent;
module.exports.CreateCatalogHiccupsLookup=CreateCatalogHiccupsLookup;
module.exports.CreateCatalogWaiver=CreateCatalogWaiver;
module.exports.CreateCatalogWaiverDueDates=CreateCatalogWaiverDueDates;
module.exports.CreateCatalogOngoingMonitoringResults=CreateCatalogOngoingMonitoringResults;
module.exports.CreateCatalogOngoingMonitoringProgram=CreateCatalogOngoingMonitoringProgram;
module.exports.CreateCatalogPrecedence=CreateCatalogPrecedence;
module.exports.CreateCatalogCategoriesLookup=CreateCatalogCategoriesLookup;
module.exports.CreateCatalogDetermination=CreateCatalogDetermination;
module.exports.CreateCatalogRatingLookup=CreateCatalogRatingLookup;
module.exports.CreateCatalogRating=CreateCatalogRating;
module.exports.CreateActivitiesLookup=CreateActivitiesLookup;
module.exports.CreateActivityID=CreateActivityID;
module.exports.CreateCatalogMRMV=CreateCatalogMRMV;
module.exports.CreateActivityAnalysts=CreateActivityAnalysts;
module.exports.CreateActivityQueries=CreateActivityQueries;
module.exports.CreateIssueSeverityLookupTable=CreateIssueSeverityLookupTable;
module.exports.CreateIssuesTable=CreateIssuesTable;
module.exports.CreateIssueSeverity=CreateIssueSeverity;
module.exports.CreateIssueEventsLookup=CreateIssueEventsLookup;
module.exports.CreateIssueEvents=CreateIssueEvents;
module.exports.CreateIssueDueDates=CreateIssueDueDates;
module.exports.CreateIssueMapping=CreateIssueMapping;
