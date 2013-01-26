var CALCULATION_INTERVAL = 1;
var db = require('./connectdb').db;
var tap = require('./taps').setDb(db);
var heart = require('./heart').setDb(db);
var Fiber = require('fibers');

var heartFibers = new Array();

function calculateHeartBeatAverageForInterval(heartToCalculate, intervalSeconds)
{
    // Convert the number of seconds to milliseconds
    var ms = intervalSeconds * 1000;

    // Get the updated count of users in the current heart
    heart.findById(heartToCalculate, function (heartInfo)
    {
        var numberOfHeartUsers = heartInfo.num_of_users;

        if (numberOfHeartUsers > 0)
        {
            // Get the all the taps in the last interval
            tap.findByHeartAndTime(heartToCalculate,ms,function(itemsFounds){calculateAverageForTaps(heartInfo,itemsFounds,numberOfHeartUsers)});
        }
        else
        {
            console.log("No heart users on heart:" + heartToCalculate);
        }
    });
};

function calculateAverageForTaps(heartInfo,heartTaps, numberOfUsers)
{
    var sumOfTaps = 0;

    // Go over all the hearts
    heartTaps.forEach(function(currHeartTap)
    {
        sumOfTaps += currHeartTap.taps / ((currHeartTap.to - currHeartTap.from) / 1000);
    });

    // Calculate the average
    var average = sumOfTaps / numberOfUsers;

    if (heartInfo.average_taps != average)
    {
        // Insert the average into the heart Data
        heart.updateAverageTaps(heartInfo._id,average,function(){console.log("Updated DB")});
    }
}

function startWorkerForHeart(heartToWork)
{
    // Perform calculations for the current heart
    setInterval(function(){calculateHeartBeatAverageForInterval(heartToWork._id,CALCULATION_INTERVAL);},1000);
}

function startBrain()
{
    console.log("Starting brain")

    // Get all the hearts from the db
    heart.findAll(function(allHearts)
    {
        // Go over each heart start a fiber for it
        allHearts.forEach(function(currHeart)
        {
            // Create a fiber for the current heart
            var curHeartFiber = Fiber(function(){startWorkerForHeart(currHeart)});

            // Start the worker
            curHeartFiber.run();
        });
    })
}

// Main - start the server threads here
console.log("Brain is Up");
startBrain();

