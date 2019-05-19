const SqlTestUtils = require('../sql_test_utils')

describe("exercise1", () => {
    const testUtils = new SqlTestUtils(["patient", "ethnicity", "symptoms", "gender", "disease"], "ex_1", ["patient", "ethnicity", "gender", "disease", "symptoms"])
    afterEach(async (done) => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Create the Patient, Ethnicity, Symptoms, Gender, and Disease tables as per the instructions (please note the spelling of each field & table name)', async (done) => {
        await testUtils.createSQLConnection()

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()

        studentQuery = studentQuery.query
        await testUtils.executeQuery(studentQuery) //in this test, query is to create a few tables with FKs

        const allTableResults = await testUtils.getAllTableResults()

        for (let result of allTableResults) {
            expect(result.result, result.message).not.toBeNull()
        }

        let validation = await testUtils.executeQuery(`
        INSERT INTO ethnicity (id, name) VALUES(0, "white");
        INSERT INTO gender (id, name) VALUES(0, "female");        
        INSERT INTO symptoms (family, fever, blue_whelts, low_bp) VALUES(0, 1, 1, 1);       
        INSERT INTO disease (name, survival_rate) VALUES("lettuce disease", 0.35);
        INSERT INTO patient (id, ethnicity, gender, symptoms_family, disease) VALUES(null, 0, 0, 0, 'lettuce disease');`)

        const getSpecificFieldErrorMessage = function (fieldErrorDetails) {
            if (fieldErrorDetails.includes('id')) {
                return "Make sure all the tables except `symptoms` and `disease` have an `id` field"
            }
            if (fieldErrorDetails.includes('name') || fieldErrorDetails.includes('family')) {
                return "Make sure the tables `symptoms` table has `family` as a primary key, and `disease` has `name` as the PK"
            }
            if (fieldErrorDetails.includes('family') || fieldErrorDetails.includes('fever') || fieldErrorDetails.includes('blue_whelts') || fieldErrorDetails.includes('low_bp')) {
                return "Make sure the `symptoms` table has the fields `family`, `fever`, `blue_whelts`, and `low_bp`"
            }
            if (fieldErrorDetails.includes('survival_rate')) {
                return "Make sure the `disease` table has the field `survival_rate`"
            }
            return "Make sure the `patient` table has the fields `ethnicity`, `gender`, `symptoms_family`, and `disease`"
        }

        expect(validation.err,
            validation.message !== testUtils.BAD_FIELD ?
                testUtils.UNKNOWN_ERROR :
                getSpecificFieldErrorMessage(validation.details.toLowerCase()))
            .toBeFalsy()

        const validateFK = (validation) => validation.err && validation.message === testUtils.FK_CONSTRAINT
        const fkMessage = (table) => `Make sure your Patient table is REFERENCEing the ${table} table correctly using a FOREIGN KEY`

        let fkValidation = await testUtils.executeQuery(`DELETE FROM ethnicity WHERE id = 0;`)
        expect(validateFK(fkValidation),
            fkMessage('ethnicity'))
            .toBeTruthy()

        fkValidation = await testUtils.executeQuery(`DELETE FROM gender WHERE id = 0;`)
        expect(validateFK(fkValidation),
            fkMessage('gender'))
            .toBeTruthy()

        fkValidation = await testUtils.executeQuery(`DELETE FROM symptoms WHERE family = 0;`)
        expect(validateFK(fkValidation),
            fkMessage('sypmtoms'))
            .toBeTruthy()

        fkValidation = await testUtils.executeQuery(`DELETE FROM disease WHERE name = 'lettuce disease'`)
        expect(validateFK(fkValidation),
            fkMessage('disease'))
            .toBeTruthy()

        done()
    })
})
