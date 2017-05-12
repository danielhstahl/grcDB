const ADODB = require('node-adodb');
const path=require('path');
const query=require('./exportQueries.js');
const sourceName='spDataMigration.accdb';
const promiseInOrder=(array, cb)=>{
  return array.reduce((p, val, index)=>{
    if(index===0){
      return p       
    }
    return p.then(res=>cb(res, val))
  }, cb(null, array[0]))
}
//const destName='normalizedSP.accdb';
const locationSource=path.format({
  dir: 'M:\\02_Governance\\08_Other\\SP Data Migration',
  base: sourceName
});
/*const locationDest=path.format({
  dir: 'M:\\02_Governance\\08_Other\\SP Data Migration',
  base: destName
});*/

const MSDB="Driver={Microsoft Access Driver (*.mdb, *.accdb)};"
const connectionSource = ADODB.open(MSDB+'Dbq='+locationSource);
//const connectionDest= ADODB.open(MSDB+'Dbq='+locationDest);
const wrapExecute=(query, connection)=>{
    return new Promise((resolve, reject)=>{
        connection.execute(query).on('done', 
          (data)=>resolve(data)
        ).on('fail', 
          (error)=>{
            reject(error)
          }
        )
    })
}

process.env.DEBUG = 'ADODB';
const createTables=(cb)=>{
  wrapExecute(query.CreateCatalog, connectionSource)
  .then((data)=>{
    return wrapExecute(query.CreateActivitiesLookup, connectionSource)
  })
  .then((data)=>{
    return wrapExecute(query.CreateActivityID, connectionSource)
  })
  .then((data)=>{
    return wrapExecute(query.CreateActivityAnalysts, connectionSource)
  })
  .then((data)=>{
    return promiseInOrder(query.CreateActivityQueries, (res, val)=>{
      return wrapExecute(val.lookup, connectionSource).then(()=>{
        return wrapExecute(val.mainQuery, connectionSource)
      })
    })
  })
  .then((data)=>{
    return wrapExecute(query.CreateIssueEventsLookup, connectionSource)
  })
  .then((data)=>{
    return wrapExecute(query.CreateIssuesTable, connectionSource)
  })
  .then((data)=>{
    return wrapExecute(query.CreateIssueSeverityLookupTable, connectionSource)
  })
  .then((data)=>{
    return wrapExecute(query.CreateIssueSeverity, connectionSource)
  })
  .then((data)=>{
    return wrapExecute(query.CreateIssueEvents, connectionSource)
  })
  .then((data)=>{
    return wrapExecute(query.CreateIssueDueDates, connectionSource)
  })
  .then((data)=>{
    return wrapExecute(query.CreateIssueMapping, connectionSource)
  }).then((data)=>{
    cb?cb(data):null
  })
  .catch(error=>console.log(error))
}
const insertRecords=()=>{
  wrapExecute("INSERT INTO IssueSeverityLookup(IssueSeverity) VALUES ('Extreme');", connectionSource)//severity lookup
  .then(()=>{
    return wrapExecute("INSERT INTO IssueSeverityLookup(IssueSeverity) VALUES ('Moderate');", connectionSource)
  })
  .then(()=>{
    return wrapExecute("INSERT INTO IssueSeverityLookup(IssueSeverity) VALUES ('High');", connectionSource)
  })
  .then(()=>{
    return wrapExecute("INSERT INTO IssueSeverityLookup(IssueSeverity) VALUES ('Low');", connectionSource)
  })
  .then(()=>{ //catalog Id
    return wrapExecute("INSERT INTO Catalog(CatalogID) SELECT DISTINCT CatalogID FROM [MigrationMappingTable];", connectionSource)
  })
  .then(()=>{ //activity lookup
    return wrapExecute("INSERT INTO ActivityLookup(ActivityType) VALUES ('Validation');", connectionSource)
  })
  .then(()=>{
    return wrapExecute("INSERT INTO ActivityLookup(ActivityType) VALUES ('Annual Review');", connectionSource)
  })

  .then(()=>{
    return wrapExecute("INSERT INTO Activity(ActivityID, ActivityType, CatalogId) SELECT ActivityId, ActivityType, CatalogId FROM  (SELECT ActivityId, CatalogId  FROM [MigrationMappingTable]) t1 INNER JOIN (SELECT ID, iif(INSTR( [Validation Activity Status], 'Validation')>0, 'Validation', iif(INSTR( [Validation Activity Status], 'Review')>0, 'Annual Review',iif(INSTR([Validation Activity Status], 'RFV')>0,'Validation',  [Validation Activity Status]))) as ActivityType FROM [SP_Model Catalog]) t2 ON t1.ActivityId=t2.ID;", connectionSource)
  })
  .then(()=>{ //all issues
    
    return wrapExecute("INSERT INTO Issues(IssueID, ActivityID) SELECT Id, ActivityID FROM  (SELECT Id, MAX([Model ID].Value) as ActivityID FROM [SP_>Issue Tracker] GROUP BY Id) t1 INNER JOIN Activity t2 ON t1.ActivityID=t2.ActivityID;", connectionSource)
  })
  .then(()=>{//sevrity
    //note that updated issue severity dates are treated as if they have been updated today!!  we don't have this visibility 
    return wrapExecute("INSERT INTO IssueSeverity(IssueID, IssueSeverity, DateModified) SELECT ID, [Original Issue Severity], [Issue Date] FROM [SP_>Issue Tracker] t1 INNER JOIN Issues t2 ON t1.ID=t2.IssueID;", connectionSource)
  })
  .then(()=>{//sevrity
    //note that updated issue severity dates are treated as if they have been updated today!!  we don't have this visibility 
    return wrapExecute("INSERT INTO IssueSeverity(IssueID, IssueSeverity, DateModified) SELECT ID, [Updated Issue Severity], NOW() FROM [SP_>Issue Tracker] t1 INNER JOIN Issues t2 ON t1.ID=t2.IssueID WHERE [Updated Issue Severity] IS NOT NULL;", connectionSource)
  })
  .then(()=>{//due date
    /**note that updated issue due dates are treated as if they have been updated today!!  we don't have this visibility */
    return wrapExecute("INSERT INTO IssueDueDates(IssueID, DueDate, DateModified) SELECT ID, [Original Due Date], [Issue Date] FROM [SP_>Issue Tracker] t1 INNER JOIN Issues t2 ON t1.ID=t2.IssueID WHERE [Original Due Date] IS NOT NULL;", connectionSource)
  })
  .then(()=>{//due date
    /**note that updated issue due dates are treated as if they have been updated today!!  we don't have this visibility */
    return wrapExecute("INSERT INTO IssueDueDates(IssueID, DueDate, DateModified) SELECT ID, [Updated Due Date], NOW() FROM [SP_>Issue Tracker] WHERE [Updated Due Date] IS NOT NULL;", connectionSource)
  })
  .then(()=>{ //issue events
    return wrapExecute("INSERT INTO IssueEventsLookup(Event) VALUES ('Issued');", connectionSource)
  })
  .then(()=>{ //issue events
    return wrapExecute("INSERT INTO IssueEventsLookup(Event) VALUES ('Remediation Submitted');", connectionSource)

  })
  .then(()=>{ //issue events
    return wrapExecute("INSERT INTO IssueEventsLookup(Event) VALUES ('Closed');", connectionSource)
  })
  .then(()=>{//issue events dates
  
    return wrapExecute("INSERT INTO IssueEvents(IssueID, Event, DateModified) SELECT ID, 'Closed', [Verification/Closed Date] FROM [SP_>Issue Tracker] t1 INNER JOIN Issues t2 ON t1.ID=t2.IssueID WHERE [Verification/Closed Date] IS NOT NULL;", connectionSource)

  })
  .then(()=>{//issue events dates
  
    /**note that closed issues with no closed date are treated as if they have been closed today!!  we don't have this visibility */
    return wrapExecute("INSERT INTO IssueEvents(IssueID, Event, DateModified) SELECT ID, 'Closed', NOW() FROM [SP_>Issue Tracker] t1 INNER JOIN Issues t2 ON t1.ID=t2.IssueID WHERE [Verification/Closed Date] IS NULL AND instr(Status, 'Closed')>0;", connectionSource)

  })
  .then(()=>{//issue events dates
  

    return wrapExecute("INSERT INTO IssueEvents(IssueID, Event, DateModified) SELECT ID, 'Issued', [Issue Date] FROM [SP_>Issue Tracker] t1 INNER JOIN Issues t2 ON t1.ID=t2.IssueID;", connectionSource)

  })
  .then(()=>{//issue events dates

    return wrapExecute("INSERT INTO IssueEvents(IssueID, Event, DateModified) SELECT ID, 'Remediation Submitted', [Owner Submitted Remediation Date] FROM [SP_>Issue Tracker] t1 INNER JOIN Issues t2 ON t1.ID=t2.IssueID WHERE [Owner Submitted Remediation Date] IS NOT NULL;", connectionSource)
  })
  .catch(error=>console.log(error))

}


createTables(insertRecords)
//insertRecords()