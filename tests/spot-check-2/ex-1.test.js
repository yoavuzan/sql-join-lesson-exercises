const SqlTestUtils = require('../sql_test_utils')

describe('spotcheck2', () => {
    const testUtils = new SqlTestUtils(['transaction', 'company', 'customer'], 'check_2', ['transaction', 'company', 'customer'])

    afterEach(async done => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('You should write a query that uses alias names', async done => {
        await testUtils.createSQLConnection()

        await testUtils.tableSetup([`
          CREATE TABLE customer
          (
            id     INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name   VARCHAR(20),
            city   VARCHAR(20),
            gender INT
          );

          CREATE TABLE company
          (
            id        INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name      VARCHAR(20),
            industry  VARCHAR(20),
            employees INT
          );

          CREATE TABLE transaction
          (
            id             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,

            item_purchased VARCHAR(20),
            amount         INT,
            discount       FLOAT DEFAULT 0,

            customer_id    INT,
            company_id     INT,
            FOREIGN KEY (customer_id) REFERENCES customer (id),
            FOREIGN KEY (company_id) REFERENCES company (id)
          );

          INSERT INTO customer (id, name, city, gender)
          VALUES (3131, "dummyname1", "dummycity1", 0);

          INSERT INTO company(id, name, industry, employees)
          VALUES (2323, "dummyname2", "dummyindustry1", 42);

          INSERT INTO transaction (item_purchased, amount, customer_id, company_id)
          VALUES ("a book", 4242, 3131, 2323);
        `])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage).toBeFalsy()

        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(studentQuery)

        expect(result.result, result.message, 'Your query results should not be null').not.toBeNull()
        result = result.result[0]

        expect(result.cust_name, `Your results should contain a field called 'cust_name'. Did you use the alias correctly?`).toBeDefined()
        expect(result.comp_name, `Your results should contain a field called 'comp_name'. Did you use the alias correctly?`).toBeDefined()

        done()
    })
})
