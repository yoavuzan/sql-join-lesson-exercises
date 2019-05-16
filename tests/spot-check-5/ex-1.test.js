const SqlTestUtils = require('../sql_test_utils')

describe("spotcheck5", () => {
    const testUtils = new SqlTestUtils("Deity", "check_5")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should query for deities name, coolness, and creation date. Order the results first by creation date, then by decreasing coolness.', async (done) => {
        const isSelect = true

        await testUtils.createSQLConnection()
        await testUtils.tableSetup([`
        CREATE TABLE Deity(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        mythology VARCHAR(20),
        main_power VARCHAR(50),
        coolness INT,
        creation_date INT
        )`,
            `INSERT INTO Deity VALUES(null, "Felurian", "derp", "dp", null , 0);`,
            `INSERT INTO Deity VALUES(null, "Hephaestus", "derp", "dp", 4, '-1400');`,
            `INSERT INTO Deity VALUES(null, "Hera", "derp", "dp", 9, '-1200');`,
            `INSERT INTO Deity VALUES(null, "Athena", "myth", "dp", 10, '-1600');`,
            `INSERT INTO Deity VALUES(null, "Zeus", "derp", "dp", 11, '-1400');`,
            `INSERT INTO Deity VALUES(null, "Mehit", "myth", "dp", 7, '-3000');`
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result
        
        let expectedOrder = ["Mehit", "Athena", "Zeus", "Hephaestus", "Hera", "Felurian"]

        expect(result.length, `Should return all deities in the correct order.`)
            .toBe(6)

        for (let i in result) {
            expect(result[i].name, "Order of deities incorrect. Remember to order first by creation_date, then by DESCending coolness")
                .toBe(expectedOrder[i])
        }

        done() //for async
    });
})
