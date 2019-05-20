const mysql = require('promise-mysql');
const fs = require('fs')
const sqlConnectionConfig = {
    host: 'localhost',
    user: 'root',
    database: 'sql_testing',
    insecureAuth: true,
    multipleStatements: true
}

class SqlTestUtils {
    constructor(tableNames, filename, supportTables) {
        this.connection = null
        this.tableNames = tableNames
        this.supportTables = supportTables
        this.filename = filename
        this.SELECT_ALL_FROM = "SELECT * FROM"
        this.DROP_TABLE = "DROP TABLE"
        this.STRING = "string"
        this.BAD_FIELD = "bad_field"
        this.FK_CONSTRAINT = "row_is_referenced"
        this.NO_SUCH_TABLE = "no_such_table"
        this.UNKNOWN_ERROR = "Something strange happened, please call for assistance"
    }

    getFilePath() {
        return `./solutions/${this.filename}.sql`
    }

    async createSQLConnection() {
        this.connection = await mysql.createConnection(sqlConnectionConfig)
    }

    async tableSetup(commands) {
        for (let command of commands) {
            await this.connection.query(command)
        }
    }

    async dropAndEndConnection() {
        await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;')
        await this.connection.query(`DROP TABLE IF EXISTS ${this.supportTables.join(",")};`)
        await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;')
        await this.connection.end()
    }

    async getQueryResult(query, shouldBeEmpty = false) {
        let result

        try {
            result = await this.connection.query(query)
        } catch (error) {
            if (error.toString().toLowerCase().includes(this.NO_SUCH_TABLE)) {
                return { result: null, message: "Error running your query, couldn't create one of the tables. It's likely the Join table - make sure you're referencing the correct column names." }
            }
            return { result: null, message: "Error running your query, please check the syntax" }
        }

        return (!shouldBeEmpty && result.length === 0) ?
            { result: null, message: `Result from query from is empty` } :
            { result }
    }

    async getAllTableResults() {
        const results = []
        for (let tableName of this.tableNames) {
            this.tableName = tableName
            let result = await this.getQueryResult(`${this.SELECT_ALL_FROM} ${tableName};`, true)

            result.tableName = tableName
            results.push(result)
        }
        return results
    }

    isExactTablename(query, tableName) {
        let startIndex = query.toLowerCase().indexOf(tableName.toLowerCase())
        let studentTableName = query.toLowerCase().substring(startIndex, startIndex + tableName.length).replace(/\W/g, '')
        return studentTableName.toLowerCase() === tableName.toLowerCase()
    }

    _error = message => { return { error: true, errorMessage: message } }

    _loadFile() {
        try {
            return fs.readFileSync(this.getFilePath(), 'utf8')
        } catch (err) { return null }
    }

    async executeQuery(query) {
        try {
            return { err: false, result: await this.connection.query(query) }
        } catch (err) {
            const code = err.code.toLowerCase()
            const error = { err: true, message: err.sqlMessage, details: err.sqlMessage }

            if (code.includes(this.BAD_FIELD)) { error.message = this.BAD_FIELD }
            if (code.includes(this.FK_CONSTRAINT)) { error.message = this.FK_CONSTRAINT }

            return error
        }
    }

    getCleanQuery(lines) {
        //remove any 'use' and comment lines
        let linesSansCommentsOrUse = lines.filter(l => l[0] !== "-" && !l.toLowerCase().includes("use"))

        for (let l in linesSansCommentsOrUse) {
            let line = linesSansCommentsOrUse[l]
            let indexOfDash = line.indexOf("--") //remove inline-comments

            if (indexOfDash > -1) {
                linesSansCommentsOrUse[l] = line.replace(line.substring(indexOfDash), "")
            }
        }
        return linesSansCommentsOrUse.join("\n")
    }

    async getStudentQuery() {
        let query = this._loadFile()
        if (query === null) { return this._error(`Bad file submission. Make sure you've uploaded a file called ${this.filename}.sql in your root directory`) }

        const lines = query.split("\n")
        if (lines.length < 1 || lines.every(l => l.length === 0)) {
            return this._error(`Seems you've submitted an empty file. Make sure your query is in ${this.filename}.sql`)
        }
        if (!lines[0].length) {
            return this._error(`Your query should start at the beginning of the file (${this.filename}.sql) - don't leave an empty line`)
        }

        for (let tableName of this.tableNames) {
            if (!query.toLowerCase().includes(tableName.toLowerCase()) || !this.isExactTablename(query, tableName)) {
                return this._error(`Wrong table name. There should be a table named ${tableName} (case insensitive)`)
            }
        }

        query = this.getCleanQuery(lines)
        return { error: false, query }
    }
}

module.exports = SqlTestUtils