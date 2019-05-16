const SqlTestUtils = require('../sql_test_utils')

describe("spotcheck6", () => {
    const testUtils = new SqlTestUtils("Deity", "check_6")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should update every deity whose coolness level is above 10 to have a coolness level of 10', async (done) => {
        const isSelect = false

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
            `INSERT INTO Deity VALUES(null, "name1", "myth", "dp", 8, 0);`,
            `INSERT INTO Deity VALUES(null, "name2", "myth", "dp", 9, 0);`,
            `INSERT INTO Deity VALUES(null, "name3", "myth", "dp", 10, 0);`,
            `INSERT INTO Deity VALUES(null, "name4", "myth", "dp", 11, 0);`,
            `INSERT INTO Deity VALUES(null, "name5", "myth", "dp", 12, 0);`
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        let expectedLevels = [8, 9, 10]

        for (let r of result) {
            expect(expectedLevels.includes(r.coolness) && r.coolness <= 10, "Only a deity whose coolness is above 10 should have their coolness changed to 10. Everyone else should stay the same.")
                .toBeTruthy()
        }

        done() //for async
    });
})
