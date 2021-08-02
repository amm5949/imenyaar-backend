const db = require ('../../../core/db/postgresql');

// if using quantitive resources such as activity limit, include project_id
const checkByManager = async (id, resource, project_id=undefined) => {
    let query = `SELECT * FROM subscriptions s
                INNER JOIN account_types at ON at.id = s.account_type_id 
                WHERE s.user_id = $1
                AND start_date <= $2
                AND end_date >= $2
                ORDER BY end_date ASC LIMIT 1`;
    date = new Date();
    const subscriptionInfo = await db.fetch({
        text: query,
        values: [id, date]
    });
    if (subscriptionInfo === undefined){
        return false;
    }
    // quantitive resource
    if (resource === 'activity'){
        query = `SELECT count(*) FROM activities WHERE project_id = $1`;
        const activityCount = (await db.fetch({text: query, values: [project_id]})).count;
        return (activityCount + 1 <= subscriptionInfo.activity_count);
    }
    const res = (subscriptionInfo[resource] === true);
    return res;
}

/* 
   checks for supervisor access to project resources
   currently each supervisor type user can only be present in
   a single manager's projects, but for future compatibility
   it's best to query this by project_id, unlike `checkByManager()`
*/
const checkByUser = async (id, resource, data) => {
    let projectManagerId, project_id;
    if (data.hasOwnProperty('project_id')){
        let query = `SELECT owner_id FROM projects p WHERE p.id = $1`;
        projectManagerId = (await db.fetch({
            text: query, 
            values: [project_id]
        })).owner_id;
    }
    else if (data.hasOwnProperty('zone_id')){
        let query = `SELECT owner_id, p.id FROM zones z
        INNER JOIN projects p ON p.id = z.project_id
        WHERE z.id = $1`;
        (
            {projectManagerId, project_id} = (await db.fetch({
                text: query, 
                values: [zone_id]
            }))
        );
    }
    const res = await checkByManager(projectManagerId, resource, data.project_id || project_id);
    return res;
}

module.exports = {
    checkByManager,
    checkByUser
}
