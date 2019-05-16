const SqlTestUtils = require('../sql_test_utils')

describe("spotcheck3", () => {
    const testUtils = new SqlTestUtils("Deity", "check_3")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should query for the deities who are both from Greek mythology AND with a coolness level greater than 8', async (done) => {
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
            `INSERT INTO Deity
        VALUES(null, "d1", "greek", "dp", 8, 0);`,
            `INSERT INTO Deity
        VALUES(null, "d2", "greek", "dp", 9, 0);`,
            `INSERT INTO Deity
        VALUES(null, "d3", "roman", "dp", 9, 0);`
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        expect(result.length, "Should return only rows where the mythology is greek, and coolness level is greater than 8.")
            .toBe(1)
        expect(result[0].name, "Hmm, got the wrong name. Make sure you're querying correctly")
            .toBe("d2")

        done() //for async
    });
})
