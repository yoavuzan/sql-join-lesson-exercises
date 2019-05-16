const SqlTestUtils = require('../sql_test_utils')

describe("spotcheck7", () => {
    const testUtils = new SqlTestUtils("Deity", "check_7")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Should remove any deity whose main power starts with the letter "w"', async (done) => {
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
            `INSERT INTO Deity VALUES(null, "name1", "myth", "fire", 0, 0);`,
            `INSERT INTO Deity VALUES(null, "name2", "myth", "water", 0, 0);`,
            `INSERT INTO Deity VALUES(null, "name3","myth",  "dow", 0, 0);`,
            `INSERT INTO Deity VALUES(null, "name4", "myth", "wind", 0, 0);`,
            `INSERT INTO Deity VALUES(null, "name5", "myth", "howl", 0, 0);`
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()
        
        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(isSelect, studentQuery)

        expect(result.result, result.message).not.toBeNull()
        result = result.result

        expect(result.length, "Should only remove deities whose main_power *starts* with 'w' - it's ok to have a 'w' elsewhere in the power")
            .toBe(3)

        for (let r of result) {
            expect(r.main_power[0] === "w", "Found a deity whose main_power begins with 'w'")
                .toBeFalsy()
        }

        done() //for async
    });
})
