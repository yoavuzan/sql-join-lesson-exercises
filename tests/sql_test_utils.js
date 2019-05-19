const mysql = require('promise-mysql');
const fs = require('fs')
const sqlConnectionConfig = {
    host: 'localhost',
    user: 'root',
    database: 'sql_intro',
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
        this.UNKNOWN_ERROR = "Something strange happened, please call for assistance"
    }

    getFilePath() {
        return `./${this.filename}.sql`
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
        await this.connection.query(`DROP TABLE IF EXISTS ${this.supportTables.join(",")};`)
        await this.connection.end()
    }

    async getQueryResult(query, shouldBeEmpty = false) {
        const badSyntaxResult = { result: null, message: "Error running your query, please check the syntax" }

        let result
        try { result = await this.connection.query(query) }
        catch (error) { return badSyntaxResult }

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
        let studentTableName = query.substring(startIndex, startIndex + tableName.length + 1).replace(/\W/g, '')
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
        if (lines[0].toLowerCase().includes("use")) {
            return this._error(`Should not have 'use' in ${this.filename}.sql file; only submit the requested query`)
        }

        for (let tableName of this.tableNames) {
            if (!query.toLowerCase().includes(tableName.toLowerCase()) || !this.isExactTablename(query, tableName)) {
                return this._error(`Wrong table name. There should be a table named ${tableName} (case insensitive)`)
            }
        }

        return { error: false, query }
    }
}

module.exports = SqlTestUtils