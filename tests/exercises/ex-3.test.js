const SqlTestUtils = require('../sql_test_utils')

describe("exercise3", () => {
    const testUtils = new SqlTestUtils("Dolphin", "ex_3")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should delete all dolphins that have a height less than 2 and are blue', async (done) => {
        const isSelect = false

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("d1", "blue", 2, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d2", "blue", 1, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d3", "green", 1, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d4", "blue", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d5", "green", 2, DEFAULT);`,
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        expect(result.length, "Unexpected number of dolphins found! Only delete those that are blue AND have a height *less than* 2.")
            .toBe(3)

        for (let r of result) {
            expect(r.name.height >= 2 && r.color != "blue", "Found a short blue dolphin. Get rid of it!")
                .toBeFalsy()
        }

        done() //for async
    });
})
