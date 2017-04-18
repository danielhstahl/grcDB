const data=require('./index')
const db=data.db
beforeAll(()=>{
    db.serialize(()=>{
        db.exec("INSERT INTO Catalog (CatalogID) VALUES ('cat1');")
        db.exec("INSERT INTO Catalog (CatalogID) VALUES ('cat2');")
        db.exec("INSERT INTO Catalog (CatalogID) VALUES ('cat3');")
    })
    
})

it("Fails insert because of Catalog PK", (done)=>{
    db.exec(`INSERT INTO CatalogName (CatalogID, Name, DateModified) 
        VALUES (
            'cat5', 'My cat1 name', datetime('now')
        )`, (err)=>{
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
        )`, (err, result)=>{
            if(err){
                throw new Error("Should have worked")
            }
            return done()
        })
})




