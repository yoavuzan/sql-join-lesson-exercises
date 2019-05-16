const SqlTestUtils = require('../sql_test_utils')

describe("exercise2", () => {
    const testUtils = new SqlTestUtils("Dolphin", "ex_2")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should find all dolphins that have "on" anywhere in their name', async (done) => {
        const isSelect = true

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("Daron", "c", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("Onda", "c", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("Draynor", "c", 0, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("Calonor", "c", 0, DEFAULT);`,
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        expect(result.length, "Unexpected number of dolphins found! Only return those that have 'on' *anywhere* in their name.")
            .toBe(3)

        for (let r of result) {
            expect(r.name.toLowerCase().includes("on"), "Found a dolphin that doesn't have 'on' in their name")
                .toBeTruthy()
        }

        done() //for async
    });
})
