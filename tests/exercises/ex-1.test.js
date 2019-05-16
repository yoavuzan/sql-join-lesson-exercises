const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    const testUtils = new SqlTestUtils(["patient", "ethnicity", "symptoms", "gender", "disease"], "ex_1")
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Create the Patient, Ethnicity, Symptoms, Gender, and Disease tables as per the instructions (please note the spelling of each field & table name)', async (done) => {
        await testUtils.createSQLConnection()

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()

        studentQuery = studentQuery.query
        await testUtils.executeQuery(studentQuery) //in this test, query is to create a few tables

        const allTableResults = await testUtils.getAllTableResults()
        for (let result of allTableResults) {
            expect(result.result, result.message).not.toBeNull()
        }

        let validation = await testUtils.executeQuery(`
        INSERT INTO ethnicity (id, name) VALUES(3, "white");
        INSERT INTO gender (id, name) VALUES(0, "female");        
        INSERT INTO symptoms (family, fever, blue_whelts, low_bp) VALUES(0, 1, 1, 1);       
        INSERT INTO disease (name, survival_rate) VALUES("lettuce disease", 0.35);
        INSERT INTO patient (id, name, ethnicity, gender, symptoms_family, disease) VALUES(null, 0, 0, 0, 'lettuce disease');`)
        console.log(validation)
        expect(validation.err,
            validation.message !== testUtils.BAD_FIELD ?
                testUtils.UNKNOWN_ERROR :
                validation.details.toLowerCase().includes('id') ?
                    "Make sure all the tables except `symptoms` and `disease` have an `id` field" :
                    validation.details.toLowerCase().includes('name') || validation.details.toLowerCase().includes('family') ?
                        "Make sure the tables `symptoms` table has `family` as a primary key, and `disease` has `name` as the PK" :
                        validation.details.toLowerCase().includes('family' || validation.details.toLowerCase().includes('fever') || validation.details.toLowerCase().includes('blue_whelts') || validation.details.toLowerCase().includes('low_bp') ?
                            "Make sure the `symptoms` table has the fields `family`, `fever`, `blue_whelts`, and `low_bp`" :
                            validation.details.toLowerCase().includes('survival_rate') ? "Make sure the `disease` table has the field `survival_rate`" :
                                "Make sure the `patient` table has the fields `ethnicity`, `gender`, `symptoms_family`, and `disease` as Foreign Keys"))
            .toBeFalsy()


        // console.log(allTableResults)
        // console.log(allTableResults[0].result)

        // result = result.result





        done() //for async
    });
})
