const validator = require('../../../core/util/validator');
const { ok, error } = require('../../../core/util/response');
const updateSchema = require('../schemas/update');
const updateService = require('../services/update');

/**
 * @api {put} /api/incidents/:id Create
 * @apiGroup Incidents
 * @apiName UpdateIncident
 * @apiVersion 1.0.0
 * @apiDescription Create a new version of the given incident with fresh info
 * @apiParam {number} [zone_id] id of the zone incident belongs to
 * @apiParam {string} [type] Type of incident, can be anything
 * @apiParam {number} [financial_damage] financial damage
 * @apiParam {number} [human_damage] human damage
 * @apiParam {string} [description] description
 * @apiParam {string} [reason] reason
 * @apiParam {integer} [hour] Hour of incident
 * @apiParam {string} [date] acceptable format is "new Date()" provided in body
 * @apiSuccessExample success-example:
 *  HTTP/1.1 200
 * {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "id": 6,
        "zone_id": 1,
        "user_id": "1",
        "type": "some new type",
        "financial_damage": 1000,
        "human_damage": 1500,
        "date": "2021-07-13T12:35:34.659Z",
        "description": "some info",
        "reason": "someone was super tired",
        "previous_version": 5
    }
}
 * @apiParamExample {json} request-example:
 * {
    "type":"some new type",
    "hour":20,
    "reason":"someone was super tired"
}
 */

const update = async (request, response) => {
    const updateValidator = validator(updateSchema, request.body);
    const { incident_id: id } = request.params;
    if (updateValidator.failed) {
        return updateValidator.response(response);
    }
    const { data } = updateValidator;
    const incident = await updateService.getIncident(id);
    if (!incident) {
        return error(response, 404, { en: 'invalid id' });
    }

    if (!(await updateService.checkAccess(request.user, incident.id))) {
        return error(response, 403, {
            en: 'you do not have access to this project',
        });
    }

    if ((await updateService.isUpdated(incident.id))) {
        return error(response, 400, { en: 'incident report has already been updated' });
    }

    if (data.date && Number.isNaN(Date.parse(data.date))) {
        return error(response, 400, { en: 'invalid date format.' });
    }

    const newData = {
        zone_id: incident.zone_id,
        type: data.type || incident.type,
        financial_damage: data.financial_damage || incident.financial_damage,
        human_damage: data.human_damage || incident.human_damage,
        reason: data.reason || incident.reason,
        date: data.date || incident.date,
        description: data.description || incident.description,
        previous_version: incident.id,
        user_id: request.user.id,
    };
    const updateIncident = await updateService.updateIncident(newData);
    return ok(response, updateIncident);
};

module.exports = async (request, response) => {
    await update(request, response);
};
