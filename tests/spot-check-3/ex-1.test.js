const SqlTestUtils = require('../sql_test_utils')

describe('spotcheck3', () => {
    const testUtils = new SqlTestUtils(['teacher', 'student', 'student_teacher'], 'check_3', ['teacher', 'student', 'student_teacher'])

    afterEach(async done => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('You should create the following tables: `student`, `teacher`, `student_teacher`', async done => {
        await testUtils.createSQLConnection()

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()

        studentQuery = studentQuery.query

        await testUtils.executeQuery(studentQuery)

        const allTableResults = await testUtils.getAllTableResults()

        for (let result of allTableResults) {
            expect(result.result, result.message).not.toBeNull()
        }

        const validation = await testUtils.executeQuery(`
          INSERT INTO Student (s_id, s_name, is_brilliant) VALUES (1, 'Ryan', 1);
          INSERT INTO Student (s_id, s_name, is_brilliant) VALUES (2, 'Leo', 1);
          INSERT INTO Student (s_id, s_name, is_brilliant) VALUES (3, 'Ernie', 0);

          INSERT INTO Teacher (t_id, t_name, is_tenured) VALUES (1, 'Levine', 1);
          INSERT INTO Teacher (t_id, t_name, is_tenured) VALUES (2, 'Foster', 0);
          INSERT INTO Teacher (t_id, t_name, is_tenured) VALUES (3, 'Schwimmer', 0);

          INSERT INTO student_teacher (student_id, teacher_id) VALUES(1, 1);
          INSERT INTO student_teacher (student_id, teacher_id) VALUES(1, 2);
          INSERT INTO student_teacher (student_id, teacher_id) VALUES(2, 1);
          INSERT INTO student_teacher (student_id, teacher_id) VALUES(2, 2);
          INSERT INTO student_teacher (student_id, teacher_id) VALUES(2, 3);
          INSERT INTO student_teacher (student_id, teacher_id) VALUES(3, 1);
        `)

        const getSpecificFieldErrorMessage = function (fieldErrorDetails) {
            if (fieldErrorDetails.includes('s_id')) {
                return "Make sure the `student` table has the field `s_id`"
            }

            if (fieldErrorDetails.includes('s_name')) {
                return "Make sure the `student` table has the field `s_name`"
            }

            if (fieldErrorDetails.includes('is_brilliant')) {
                return "Make sure the `student` table has the field `is_brilliant`"
            }

            if (fieldErrorDetails.includes('t_id')) {
                return "Make sure the `teacher` table has the field `t_id`"
            }

            if (fieldErrorDetails.includes('t_name')) {
                return "Make sure the `teacher` table has the field `t_name`"
            }

            if (fieldErrorDetails.includes('is_tenured')) {
                return "Make sure the `teacher` table has the field `is_tenured`"
            }

            return "Make sure the `student_teacher` table has the fields `student_id`, and `teacher_id`"
        }

        const validateFK = (validation) => validation.err && validation.message === testUtils.FK_CONSTRAINT
        const fkMessage = (table) => `Make sure your 'student_teacher' table is REFERENCEing the ${table} table correctly using a FOREIGN KEY`

        expect(validation.err,
            validation.message !== testUtils.BAD_FIELD ?
                testUtils.UNKNOWN_ERROR :
                getSpecificFieldErrorMessage(validation.details.toLowerCase()))
            .toBeFalsy()

        let fkValidation = await testUtils.executeQuery(`DELETE FROM student WHERE s_id = 1;`)
        expect(validateFK(fkValidation),
            fkMessage('student'))
            .toBeTruthy()

        fkValidation = await testUtils.executeQuery(`DELETE FROM teacher WHERE t_id = 1;`)
        expect(validateFK(fkValidation),
            fkMessage('teacher'))
            .toBeTruthy()

        done()
    })
})
