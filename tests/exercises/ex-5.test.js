const SqlTestUtils = require('../sql_test_utils')

describe("exercise5", () => {
    const testUtils = new SqlTestUtils("Dolphin", "ex_5")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should update any the "healthy" column of any dolphin for any brown or green dolphin to FALSE', async (done) => {
        const isSelect = false

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("d1", "blue", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d2", "green", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d3", "yellow", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d4", "brown", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d5", "red", 0, DEFAULT);`
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()

        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        let healthyCount = result.filter(d => d.healthy === 1).length
        expect(healthyCount, "Unexpected number of healthy dolphins! Only update the 'healthy' to FALSE for dolphins that are either brown OR green")
            .toBe(3)

        let d2 = result.find(d => d.name === "d2")
        let d4 = result.find(d => d.name === "d4")

        for(let d of [d2, d4]){
            expect(d, "Hmm, we're missing a dolphin. Make sure you're only updating, and not deleting anything by mistake")
                .toBeTruthy()
    
            expect(d.healthy, `Found a ${d.color} dolphin tagged as healthy - should be false!`)
                .toBeFalsy()
        }

        done() //for async
    });
})
