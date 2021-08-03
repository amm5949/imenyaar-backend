const db = require ('../../../core/db/postgresql');

// if using quantitive resources such as activity limit, include project_id
const checkByManager = async (id, resource, data) => {
    let query = `SELECT * FROM subscriptions s
                INNER JOIN account_types at ON at.id = s.account_type_id 
                WHERE s.user_id = $1
                AND start_date <= $2
                AND end_date >= $2
                AND is_verified = true
                ORDER BY end_date LIMIT 1`;
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
        const activityCount = (await db.fetch({text: query, values: [data.project_id]})).count;
        return (activityCount + 1 <= subscriptionInfo.activity_count);
    }
    const res = (subscriptionInfo[resource] == true);
    return res;
}

/* 
   checks for supervisor access to project resources
   currently each supervisor type user can only be present in
   a single manager's projects, but for future compatibility
   it's best to query this by project_id, unlike `checkByManager()`
*/
const checkByUser = async (id, resource, data) => {
    let owner_id, project_id;
    if (data.hasOwnProperty('project_id')){
        let query = `SELECT * FROM projects p WHERE p.id = $1`;
        owner_id = (await db.fetch({
            text: query, 
            values: [data.project_id]
        })).owner_id;
    }
    else if (data.hasOwnProperty('zone_id')){
        let query = `SELECT owner_id, p.id as project_id FROM zones z
        INNER JOIN projects p ON p.id = z.project_id
        WHERE z.id = $1`;
        (
            {owner_id, project_id} = (await db.fetch({
                text: query, 
                values: [data.zone_id]
            }))
        );
    }
    const res = await checkByManager(owner_id, resource, {project_id: data.project_id || project_id});
    return res;
}

module.exports = {
    checkByManager,
    checkByUser
}
