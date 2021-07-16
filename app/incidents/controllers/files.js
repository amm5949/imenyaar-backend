const { v4: uuidv4 } = require('uuid');
const filesService = require('../services/files');
const { ok } = require('../../../core/util/response');

/**
 * @api {post} /api/incidents/files AddFiles
 * @apiGroup Incidents
 * @apiName Files
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Use this endpoint to send files of the incident.<br>
 * File's field name should be: image-{name} or voice-{name} based on
 * whether it is a image or voice.
 * This api will generate a uuid for naming the files on server and return sent file names,
 * uuid (saved file name)
 * and file id for each file in the request. Using file id, you can attach the files to
 * answers in your incident.
 * File id's can be re-attached using update or even create api's if user has access to incident.
 * Use this option wisely!
 *
 * @apiSuccess {Array} images list of image file results
 * @apiSuccess {Array} voices list of voice file results
 * @apiSuccess {string} images.*.name name of file originally passed
 * @apiSuccess {string} images.*.id    image id
 * @apiSuccess {string} voices.*.name name of voice originally passed
 * @apiSuccess {string} voices.*.id    voice id
 *
 * @apiSuccessExample
 * {
    "status": "ok",
    "message": {
        "en": "Request was successful",
        "fa": "درخواست موفقیت آمیز بود"
    },
    "result": {
        "images": [
            {
                "name": "image-google",
                "id": "9"
            }
        ],
        "voices": [
            {
                "name": "voice-now we're free",
                "id": "9"
            }
        ]
    }
}
 *
 */
const upload = async (request, response) => {
    const files = Object.entries(request.files || {});

    const voiceFiles = files.filter(([name]) => name.substr(0, 5) === 'voice');
    const imageFiles = files.filter(([name]) => name.substr(0, 5) === 'image');

    const store = (file, part) => {
        const type = file.name.split('.')
            .pop();
        const path = `uploads/${part}/${uuidv4()}.${type}`;
        file.mv(path);
        return path;
    };

    const images = imageFiles.map(([name, filesList]) => {
        // Store image.
        const arr = Array.isArray(filesList) ? filesList : [filesList];
        return arr.map((image) => ({
            path: store(image, 'images'),
            name,
        }));
    })
        .flat();

    const voices = voiceFiles.map(([name, filesList]) => {
        // Store voice.
        const arr = Array.isArray(filesList) ? filesList : [filesList];
        return arr.map((voice) => ({
            path: store(voice, 'voices'),
            name,
        }));
    })
        .flat();

    const { imageResults, voiceResults } = await filesService.insertFiles(images, voices);
    const imageResponse = images.map((item, i) => ({ name: item.name, id: imageResults[i].id }));
    const voiceResponse = voices.map((item, i) => ({ name: item.name, id: voiceResults[i].id }));

    return ok(response, { images: imageResponse, voices: voiceResponse });
};

module.exports = async (request, response) => {
    await upload(request, response);
};
