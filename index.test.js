const data=require('./index')
const db=data.db
beforeEach(()=>{
    //db.serialize(()=>{
    db.exec("INSERT INTO Catalog (CatalogID) VALUES ('cat1');")
    db.exec("INSERT INTO Catalog (CatalogID) VALUES ('cat2');")
    db.exec("INSERT INTO Catalog (CatalogID) VALUES ('cat3');")
    db.exec("INSERT INTO CatalogEventLookup (CatalogEvent) VALUES ('Development Date');")
    db.exec("INSERT INTO CatalogEventLookup (CatalogEvent) VALUES ('Implementation Date');")
    db.exec("INSERT INTO CatalogEventLookup (CatalogEvent) VALUES ('Retirement Date');")
    db.exec(`INSERT INTO CatalogDeterminationLookup (DeterminationType) VALUES ('Model');`)
    db.exec(`INSERT INTO CatalogDeterminationLookup (DeterminationType) VALUES ('Tool');`)
    db.exec(`INSERT INTO CatalogDeterminationLookup (DeterminationType) VALUES ('Procedures');`)
    db.exec(`INSERT INTO CatalogRatingLookup (Rating) VALUES ('Pass');`)
    db.exec(`INSERT INTO CatalogRatingLookup (Rating) VALUES ('Low-Pass');`)
    db.exec(`INSERT INTO CatalogRatingLookup (Rating) VALUES ('Fail');`)
    db.exec(`INSERT INTO ActivityLookup (ActivityType) VALUES ('Validation');`)
    db.exec(`INSERT INTO ActivityLookup (ActivityType) VALUES ('Annual Review');`)
    db.exec(`INSERT INTO ActivityLookup (ActivityType) VALUES ('Ongoing Monitoring');`)
    db.exec(`INSERT INTO IssueSeverityLookup (IssueSeverity) VALUES ('High');`)
    db.exec(`INSERT INTO IssueSeverityLookup (IssueSeverity) VALUES ('Moderate');`)
    db.exec(`INSERT INTO IssueSeverityLookup (IssueSeverity) VALUES ('Low');`)
    db.exec(`INSERT INTO IssueSeverityLookup (IssueSeverity) VALUES ('Extreme');`)
    db.exec(`INSERT INTO ISsueEventsLookup (event) VALUES ('Issue Opened');`)
    db.exec(`INSERT INTO ISsueEventsLookup (event) VALUES ('Remediation Submitted');`)
    db.exec(`INSERT INTO ISsueEventsLookup (event) VALUES ('Issue Closed');`)

    //})
    
})

afterEach(()=>{
    db.exec("DELETE FROM Catalog;")
    db.exec("DELETE FROM CatalogDeterminationLookup;")
    db.exec("DELETE FROM CatalogEventLookup;")
    db.exec("DELETE FROM CatalogRatingLookup;")
    db.exec("DELETE FROM ActivityLookup;")
    db.exec("DELETE FROM IssueSeverityLookup;")
    db.exec("DELETE FROM ISsueEventsLookup;")
})

it("Fails insert because of CatalogName->Catalog PK", (done)=>{
    db.exec(`INSERT INTO CatalogName (CatalogID, Name, DateModified) 
        VALUES (
            'cat5', 'My cat1 name', datetime('now')
        );`, (err)=>{
            db.exec(`DELETE FROM CatalogName;`)
            if(err){
                return done()
            }
            throw new Error("Should have errored")
            done()
        })
})
it("inserts into CatalogName", (done)=>{
    db.exec(`INSERT INTO CatalogName (CatalogID, Name, DateModified) 
        VALUES (
            'cat1', 'My cat1 name', datetime('now')
        );`, (err)=>{
            db.exec(`DELETE FROM CatalogName;`)
            if(err){
                throw new Error("Should have worked")
            }
            return done()
        })
})


it("Fails insert because of CatalogDeterminationLookup->CatalogDetermination FK", (done)=>{
    db.exec(`INSERT INTO CatalogDetermination (CatalogID, DeterminationType, DateModified) 
    VALUES (
        'cat1', 'noexist', datetime('now')
    );`, (err)=>{
        db.exec(`DELETE FROM CatalogDetermination;`)
        if(err){
            return done()
        }
        throw new Error("Should have errored")
        done()
    })      
    
})
it("inserts records into CatalogDetermination", (done)=>{
    db.exec(`INSERT INTO CatalogDetermination (CatalogID, DeterminationType, DateModified) 
    VALUES (
        'cat1', 'Model', datetime('now')
    );`, (err)=>{
        db.exec(`DELETE FROM CatalogDetermination;`)
        if(err){
            throw new Error("Should not have errored")
        }
        return done()
    })
    
})


it("Fails insert because of CreateCatalogEventLookup->CatalogEvents FK", (done)=>{
    db.exec(`INSERT INTO CatalogEvents (CatalogID, CatalogEvent, DateOfEvent, DateModified) 
    VALUES (
        'cat1', 'noexist',date('2016-01-01'), datetime('now')
    );`, (err)=>{
        db.exec(`DELETE FROM CatalogEvents;`)
        if(err){
            return done()
        }
        throw new Error("Should have errored")
        done()
    })      
    
})
it("inserts records into CatalogEvents", (done)=>{
    db.exec(`INSERT INTO CatalogEvents (CatalogID, CatalogEvent, DateOfEvent, DateModified) 
    VALUES (
        'cat1', 'Implementation Date', date('2016-01-01'), datetime('now')
    );`, (err)=>{
        db.exec(`DELETE FROM CatalogEvents;`)
        if(err){
            throw new Error("Should not have errored")
        }
        return done()
    })
    
})






