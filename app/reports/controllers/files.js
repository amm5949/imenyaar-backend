const { v4: uuidv4 } = require('uuid');
const filesService = require('../services/files');
const { ok, error } = require('../../../core/util/response');
const accessCheck = require('../helpers/access');
/**
 * @api {post} /api/reports/files Addfiles
 * @apiGroup Reports
 * @apiName Files
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Use this endpoint to send files of the report.<br>
 * File's field name should be: image-{name} or voice-{name} based on whether it is a image or voice.
 * This api will generate a uuid for naming the files on server and return sent file names, uuid (saved file name)
 * and file id for each file in the request. Using file id, you can attach the files to answers in your report.
 * File id's can be re-attached using update or even create api's if user has access to report. Use this option wisely!
 * 
 * @apiSuccess {Array} images list of image file results
 * @apiSuccess {Array} voices list of voice file results
 * @apiSuccess {string} images.*.path path of saved image on server
 * @apiSuccess {string} images.*.name name of file originally passed
 * @apiSuccess {string} images.*.id    image id
 * @apiSuccess {string} images.*.answer_id  id of answer linked to image, initially null
 * @apiSuccess {string} voices.*.path path of saved voice on server
 * @apiSuccess {string} voices.*.name name of voice originally passed
 * @apiSuccess {string} voices.*.id    voice id
 * @apiSuccess {string} voices.*.answer_id  id of answer linked to voice, initially null
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
                "path": "uploads/images/8ef6f699-2fbf-4b0b-be15-bc8d2fbd21e9.png",
                "name": "image-google",
                "id": "10",
                "answer_id": null,
                "is_deleted": false
            }
        ],
        "voices": [
            {
                "path": "uploads/voices/ef8168e6-908f-41f8-a7b5-d6287c6ab66f.mp3",
                "name": "voice-now we're free",
                "id": "8",
                "answer_id": null,
                "is_deleted": false
            }
        ]
    }
}
 * 
 */
const get = async (request, response) => {
    const { user } = request;

    const files = Object.entries(request.files || {});

    const voiceFiles = files.filter(([name]) => name.substr(0, 5) === 'voice');
    const imageFiles = files.filter(([name]) => name.substr(0, 5) === 'image');

    const store = (image, part) => {
        const type = image.name.split('.').pop();
        const path = `uploads/${part}/${uuidv4()}.${type}`;
        image.mv(path);
        return path;
    };

    const images = imageFiles.map(([name, filesList]) => {
        // if (!acceptableImageMimeTypes.find(image.mimetype)) {
        //     return undefined;
        // }

        // Store image.
        const arr = Array.isArray(filesList) ? filesList : [filesList];
        return arr.map((image) => ({
            path: store(image, 'images'),
            name: name,
        }));
    }).flat();

    const voices = voiceFiles.map(([name, filesList]) => {
        // if (!acceptableImageMimeTypes.find(image.mimetype)) {
        //     return undefined;
        // }

        // Store voice.
        const arr = Array.isArray(filesList) ? filesList : [filesList];
        return arr.map((voice) => ({
            path: store(voice, 'voices'),
            name: name,
        }));
    }).flat();

    const {imageRes, voiceRes} = await filesService(images, voices);
    const imageResults = images.map((item, i) => 
        Object.assign({}, item, imageRes[i]));
    const voiceResults = voices.map((item, i) => 
        Object.assign({}, item, voiceRes[i]));



    return ok(response, {images: imageResults, voices: voiceResults});
};

module.exports = get;
