'use strict'
const utilities = require('./utilities.js')

module.exports = {
    /**
   * Iterates over oddschecker data to find nested objects within a collection
   * @param {array} queryIds 
   * @param {string} dataSetQuery 
   */
    getOddsData: async function (queryIds, dataSetQuery) {
        try {
            const keyPath = dataSetQuery.split('.')
            let oddsData = await utilities.getData('oddschecker')
            oddsData = oddsData instanceof Array ? oddsData : [oddsData]
         
            keyPath.forEach((targetCollection)=> {
                let returnData = []
                oddsData.forEach((element)=> {
                    element[targetCollection].forEach((el)=> {
                        returnData.push(el)
                    })
                }) 
                oddsData = returnData     
            })
    
            const IdTarget = `${keyPath[keyPath.length -1].slice(0,-1)}Id`
    
            if (!queryIds)  {
                return oddsData
            } else {
                return oddsData.filter((element)=> {
                    return queryIds.indexOf(element[IdTarget].toString()) > -1
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
}