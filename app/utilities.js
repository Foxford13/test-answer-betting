
'use strict'
const fs = require('fs')
const util = require('util')
const path = require('path')
module.exports = {
    /**
   *    Reads data from a specifed file
   * @param {string} fileName 
   */
    getData: async function (fileName) {
        const readFile = util.promisify(fs.readFile)
        let data
        try {
            data = await readFile(path.join(__dirname, `../resources/${fileName}.json`), 'utf8')
        } catch(err) {
            console.error(err)
        }
        return JSON.parse(data)
    },    
    /**
    *    Writes data to a file 
    * @param {string} fileName 
    * @param {array} data 
    */
    writeToFile: async function (fileName, data) {
        const writeFile = util.promisify(fs.writeFile)
        let jsonData = JSON.stringify(data)
        
        try {
            await writeFile(path.join(__dirname, `../resources/${fileName}.json`), jsonData, 'utf8')
        } catch(err) {
            console.error(err)
        }
    },

    uniqueIdGenerator: function () {
        return Math.floor(Math.random() * 100000) + 1  
    }
}