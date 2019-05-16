const SqlTestUtils = require('../sql_test_utils')

describe("spotcheckX or exerciseX", () => {
  const testUtils = new SqlTestUtils("TABLE NAME", "check_X or ex_X")
  afterEach(async (done) => {
    await testUtils.dropAndEndConnection()
    done()
  })

  it('DESCRIBE REQS', async (done) => {
    const isSelect = false

    await testUtils.createSQLConnection()
    await testUtils.tableSetup([`
        SETUP TABLE AND ANY INSERTS`])

    let studentQuery = await testUtils.getStudentQuery()
    expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()

    studentQuery = studentQuery.query
    let result = await testUtils.getQueryResult(isSelect, studentQuery)

    expect(result.result, result.message).not.toBeNull()
    result = result.result

    //RUN TESTS ON `result`

    done() //for async
  });
})
