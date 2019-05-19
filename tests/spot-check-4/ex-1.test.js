const SqlTestUtils = require('../sql_test_utils')

describe('spotcheck4', () => {
    const testUtils = new SqlTestUtils(['teacher', 'student', 'student_teacher'], 'check_4', ['teacher', 'student', 'student_teacher'])

    afterEach(async done => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('You should find all the student names that have Foster as their teacher', async done => {
        await testUtils.createSQLConnection()

        await testUtils.tableSetup([`
          CREATE TABLE student
          (
            s_id         int PRIMARY KEY UNIQUE,
            s_name       varchar(50),
            is_brilliant bool
          );

          CREATE TABLE teacher
          (
            t_id       int PRIMARY KEY UNIQUE,
            t_name     varchar(50),
            is_tenured bool
          );

          CREATE TABLE student_teacher
          (
            student_id int,
            teacher_id int,
            FOREIGN KEY (student_id) REFERENCES student (s_id),
            FOREIGN KEY (teacher_id) REFERENCES teacher (t_id)
          );

          INSERT INTO Student
          VALUES (1, 'Ryan', 1); -- note the use of 1 for TRUE
          INSERT INTO Student
          VALUES (2, 'Leo', 1);
          INSERT INTO Student
          VALUES (3, 'Ernie', 0); -- and 0 for FALSE in SQL

          INSERT INTO Teacher
          VALUES (1, 'Levine', 1);
          INSERT INTO Teacher
          VALUES (2, 'Foster', 0);
          INSERT INTO Teacher
          VALUES (3, 'Schwimmer', 0);

          INSERT INTO student_teacher
          VALUES (1, 1);
          INSERT INTO student_teacher
          VALUES (1, 2);
          INSERT INTO student_teacher
          VALUES (2, 1);
          INSERT INTO student_teacher
          VALUES (2, 2);
          INSERT INTO student_teacher
          VALUES (2, 3);
          INSERT INTO student_teacher
          VALUES (3, 1);
        `])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()

        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(studentQuery)

        expect(result.result, result.message, 'Your query results should not be null').not.toBeNull()

        expect(result.result.length, "Your query should return different number of results. It should only return the names of Foster's students (Ryan and Leo)").toBe(2)
        result = result.result

        expect(result[0], "Couldn't find Ryan under the `s_name` column. Remember to join both on the teacher's name (hard-coded) AND the student/teacher IDs").toEqual({s_name: 'Ryan'})
        expect(result[1], "Couldn't find Leo under the `s_name` column. Remember to join both on the teacher's name (hard-coded) AND the student/teacher IDs").toEqual({s_name: 'Leo'})

        done()
    })
})
