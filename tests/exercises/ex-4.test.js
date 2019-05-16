const SqlTestUtils = require('../sql_test_utils')

describe("exercise4", () => {
    const testUtils = new SqlTestUtils("Dolphin", "ex_4")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should update Daron to have a height of 6', async (done) => {
        const isSelect = false

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("carl", "c", 2, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("daron", "blue", 9, DEFAULT);`
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        let daron = result.find(d => d.name === "daron")
        let carl = result.find(d => d.name === "carl")

        expect(daron.height, "Should change the dolphin who has a name of 'Daron' so that he has a height of 6")
            .toBe(6)
        expect(carl.height, "Should not change any other dolphin's height")
            .toBe(2)

        done() //for async
    });
})
