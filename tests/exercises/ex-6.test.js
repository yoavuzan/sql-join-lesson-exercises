const SqlTestUtils = require('../sql_test_utils')

describe("exercise6", () => {
    const testUtils = new SqlTestUtils("Dolphin", "ex_6")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should retrieve only the name and height for all the healthy dolphins sorted by their height (tallest to shortest)', async (done) => {
        const isSelect = true

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Dolphin(
            name VARCHAR(20) NOT NULL PRIMARY KEY,
            color VARCHAR(20),
            height INT,
            healthy BOOLEAN DEFAULT TRUE
        )`,
            `INSERT INTO Dolphin VALUES("d1", "c", 6, FALSE);`,
            `INSERT INTO Dolphin VALUES("d2", "c", 4, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d3", "c", 6, DEFAULT);`,
            `INSERT INTO Dolphin VALUES("d4", "c", 3, FALSE);`,
            `INSERT INTO Dolphin VALUES("d5", "c", 2, DEFAULT);`
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        expect(result.length, "Unexpected number of dolphins! Only return the healthy ones")
            .toBe(3)
        expect(result[0].color, "Only return the name and height of the dolphins, not the other columns.")
            .toBeUndefined()

        const expectedHeights = [6, 4, 2]
        for (let i in result) {
            expect(result[i].height, "Found a dolphin in the wrong order. Make sure you ORDER them BY their DESCending height")
                .toBe(expectedHeights[i])
        }

        done() //for async
    });
})
