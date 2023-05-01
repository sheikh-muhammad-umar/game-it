/**
 * Game Statistics Utility functions
 */

/**
 * @public
 * @static
 * @namespace GameStatsHelper
 * Calculate Game Statistics
 * @param {} data2 - The JSON data
 * @returns {string} - Calculated results
 * @throws {Error} - Error
 */
 function gameStats (game, data) {
    
    var progressData = groupBySessionType(data)['progress'];
    var sessions = groupBy(progressData, 'sessionId');

    var stats = [];

    Object.keys(sessions).forEach(function(k) {
        var groupedByLevel = groupBy(sessions[k], 'difficultyLevel');
        
        var session = {};

        for (row of game.levels) {
            var level=row.level;
            var groupedData = groupedByLevel[level];
            if (groupedData !== undefined)
                session[level] = calculateStats(row, groupedData);
        }
        var levels = session;
        var record = {
            sessionId:k,
            levels
        };
        stats.push (record);

    });

    return stats;
}

function calculateStats (level, groupedData) {
    const formatter = Intl.NumberFormat('en-US', {
        style: 'percent',
    })
    
    avSpentTime = 0;
    
    spentTime = sum(groupedData, 'spentTime');
    whiteCrystals = sum(groupedData, 'whiteCrystalNum');
    mistakes = sum(groupedData, 'mistakesNum');
    completedActivity = sum(groupedData, 'completedActivityNum');
    totalActivity = level.activityTotal;
    totalWC = level.whiteCrystalTotal;
    scorePercent = formatter.format(whiteCrystals / totalWC);

    var row = {
        completedActivity,
        spentTime,
        whiteCrystals,
        mistakes,
        scorePercent
    };

    return(row);

}

function groupBy(objectArray, property) {
    return objectArray.reduce(function(acc, obj) {
        var key = obj.data[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

function groupBySessionType(objectArray) {
    return objectArray.reduce(function(acc, obj) {
        var key = obj.type;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

function sum(newData, field) {
    let sum = 0;
    newData.forEach((item) => { sum += item['data'][field] });
    return sum;
}

module.exports = {
	gameStats
};
