const { ok } = require('../../../core/util/response');
const imageService = require('../services/image');

const addImage = async (request, response) => {
    const { id } = request.params;
    const images = Array.isArray(request.files.images) ? request.files.images
        : [request.files.images];
    const paths = images.map((i) => {
        const path = `uploades/${id}-${i.name}`;
        i.mv(path);
        return path;
    });
    if (images.length) {
        imageService.save(id, paths);
    }
    return ok(response, {});
};

module.exports = async (request, response) => {
    await addImage(request, response);
};
