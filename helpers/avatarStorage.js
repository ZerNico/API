const fs = require('fs');
const sharp = require('sharp');

function avatarStorage (opts) {
    this.getDestination = (opts.destination || getDestination);
};

avatarStorage.prototype._handleFile = function _handleFile(req, file, cb) {
    this.getDestination(req, file, function (err, path) {
        if (err) return cb(err);
        const outStream = fs.createWriteStream(path);
        const transform = sharp().resize(800, 800).background('black').embed().jpeg({quality: 70});

        file.stream.pipe(transform).pipe(outStream);
        outStream.on('error', cb);

        outStream.on('finish', function () {
            cb(null, {
                path: path,
                size: outStream.bytesWritten
            });
        });
    });
};

avatarStorage.prototype._removeFile = function _removeFile(req, file, cb) {
    fs.unlink(file.path, cb);
};

module.exports = function (opts) {
    return new avatarStorage(opts);
};