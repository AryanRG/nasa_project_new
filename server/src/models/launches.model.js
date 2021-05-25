const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const launches =new Map();

let latestFlightNumber = 101;

const launch ={
    
    mission : 'Kepler Exploration X',
    rocket : 'Explorer IS1',
    launchDate : new Date('December 27. 2030'),
    target : 'Kepler-442 b',
    customer : ['ZTM', 'NASA'],
    upcoming : true, 
    success: true,
    flightNumber : 101,
};

saveLaunch(launch);


function existsLaunchWithId(launchId){
    return launches.has(launchId);
}

async function getAllLaunches(){
    return await launchesDatabase.
    find({},{ '__v': 0 , '_id' :0 });
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName : launch.target,
    });

    if(!planet){
        throw new Error('No matching planet found');
    }

    await launchesDatabase.updateOne({
        flightNumber : launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(
        latestFlightNumber, 
        Object.assign(launch,{
            success : true,
            upcoming :true,
            customers : ['ztm', 'NASA'],
            flightNumber : latestFlightNumber,
    })
    );
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming =false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
};