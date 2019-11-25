'use strict'
const utilities = require('./utilities.js')

module.exports = {
  /**
   * Returns Oddschecker standardised values for a string from external bookmaker
   * @param {string} term 
   * @param {array} type 
   * @param {array} synonymsData 
   */
    synonymChecker: function  (term, types, synonymsData) {
        let cleanData
        types.forEach((type) => {
            const rgx = new RegExp(type, 'i')
            cleanData = synonymsData.filter(function (el) {
               return el.type.match(rgx) && (el.synonyms.indexOf(term) > -1)
           })
        })
        
        return cleanData[0] ? cleanData[0].oddschecker_keyword : term
    },
    /**
   *  Transforms data from external bookmakers to Oddschecker format
   */
    transformExtDataToOdds : async function  () {
        let transformedFeed
        try {
            let bookFeed = await utilities.getData('bookmaker-feed')
            bookFeed = bookFeed instanceof Array ? bookFeed : [bookFeed]

            transformedFeed = await Promise.all(bookFeed.map(async (element)=> {
               return await this.dataConverter(element.sport, element.competitions)
            }))
            
            await utilities.writeToFile('oddschecker', transformedFeed)
        } catch (err) {
            console.error(err)
        }
        return transformedFeed
    },
    /**
   *  Converts subevent name to Oddschecker values
   * @param {string} subeventName 
   * @param {array} synonyms 
   */
    convertSubeventName: function (subeventName, synonyms) {
        return  `${this.synonymChecker((subeventName.split('vs.')[0]).trim(), ['participant_name'], synonyms)} vs. ` + 
                `${this.synonymChecker((subeventName.split('vs.')[1]).trim(), ['participant_name'], synonyms)}`
    },
    /**
   *  Returns an object with schemas standardised values and keys
   * @param {string} sport 
   * @param {array} competitions 
   */
    dataConverter: async function (sport, competitions) {
        try {
            const  _this = this
            const synonyms = await utilities.getData('synonyms')

            return {
                categoryName:  _this.synonymChecker(sport, ['category_name'], synonyms),
                categoryId: utilities.uniqueIdGenerator(), // TODO: Should I generate random Ids in place of the original ones?
                events:  competitions.map(({ name, matches }, id) => ({
                    eventId: id+1,
                    eventName:  _this.synonymChecker(name, ['event_name'], synonyms),
                    subevents:  matches.map(({ name, markets }, id) => ({
                        subeventId: id + 1,
                        subeventName:  _this.convertSubeventName(name, synonyms),
                        markets:  markets.map(({ id, name, outcomes }) => ({
                        marketId: parseInt(id),
                        marketName:  _this.synonymChecker(name, ['market_name'], synonyms),
                            bets:  outcomes.map(({ id, name, odds }) => ({
                                betId: parseInt(id),
                                betName:  _this.synonymChecker(name, ['market_name', 'participant_name'], synonyms),
                                oddsDecimal: parseFloat(odds)
                            }))
                        }))
                    }))
                }))
            }
        } catch (err) {
            console.error(err)
        }
    }
}

