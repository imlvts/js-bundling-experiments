// Since pax doesn't publish to npm we need to download it manually,
// a better solution would be to create npm packages
/*!
 * Copied from node-sass: scripts/install.js
 */


const fs = require("fs"),
  os = require("os"),
  eol = require("os").EOL,
  fetch = require("node-fetch"),
  mkdir = require("mkdirp"),
  path = require("path"),
  gunzip = require("gunzip-maybe"),
  tar = require("tar-fs"),
  url = require("url"),
  unzipper = require("unzipper"),
  ProgressBar = require("progress"),
  env = process.env;

/**
 * Download file, if succeeds save, if not delete
 *
 * @param {String} url
 * @param {String} dest
 * @param {Function} cb
 * @api private
 */

function download(url, dest, cb) {
  var reportError = function(err) {
    var timeoutMessge;

    if (err.code === "ETIMEDOUT") {
      if (err.connect === true) {
        // timeout is hit while your client is attempting to establish a connection to a remote machine
        timeoutMessge = "Timed out attemping to establish a remote connection";
      } else {
        timeoutMessge = "Timed out whilst downloading the prebuilt binary";
        // occurs any time the server is too slow to send back a part of the response
      }
    }
    cb(
      [
        'Cannot download "',
        url,
        '": ',
        eol,
        eol,
        typeof err.message === "string" ? err.message : err,
        eol,
        eol,
        timeoutMessge ? timeoutMessge + eol + eol : timeoutMessge,
        "Hint: If github.com is not accessible in your location",
        eol,
        "      try setting a proxy via HTTP_PROXY, e.g. ",
        eol,
        eol,
        "      export HTTP_PROXY=http://example.com:1234",
        eol,
        eol,
        "or configure npm proxy via",
        eol,
        eol,
        "      npm config set proxy http://example.com:8080"
      ].join("")
    );
  };

  console.log("Downloading binary from", url);

  try {
    fetch(url).then(function(resp) {
      if (200 <= resp.status && resp.status < 300) {
        const length = +resp.headers.get("Content-Length");
        var progress = new ProgressBar(":bar", { total: length });
        progress.render();
        // The `progress` is true by default. However if it has not
        // been explicitly set it's `undefined` which is considered
        // as far as npm is concerned.
        if (true) {
          resp.body
            .on("data", function(chunk) {
              progress.tick(chunk.length);
            })
            .on("end", function() {
              progress.terminate();
            });
        }

        resp.body.on("error", cb);
        resp.body.pipe(
          fs.createWriteStream(dest).on("close", function() {
            cb();
            console.log("Download complete");
          })
        );
      } else {
        reportError(
          ["HTTP error", resp.statusCode, resp.statusMessage].join(" ")
        );
      }
    }, reportError);
  } catch (err) {
    cb(err);
  }
}

// pax binaries for different archs https://github.com/nathan/pax/releases/tag/pax-v0.4.1-alpha
const downloadBase = 'https://github.com/nathan/pax/releases/download';
const paxVer = 'v0.4.1-alpha';
const architectures = {
  'linux-x64': `${downloadBase}/pax-${paxVer}/pax-${paxVer}-x86_64-unknown-linux-gnu.tar.gz`,
  'darwin-x64': `${downloadBase}/pax-${paxVer}/pax-${paxVer}-x86_64-apple-darwin.tar.gz`,
  'win32-x64': `${downloadBase}/pax-${paxVer}/pax-${paxVer}-x86_64-pc-windows-gnu.zip`,
  'win32-i686': `${downloadBase}/pax-${paxVer}/pax-${paxVer}-i686-pc-windows-gnu.zip`,
};

function downloadBinary(cb) {
  const system = process.platform + '-' + process.arch;
  const destDir = 'pax-bin';

  if (!architectures.hasOwnProperty(system)) {
    return cb('Unsupported system: ' + system);
  }

  const binaryName = process.platform === 'win32' ? 'px.exe' : 'px';

  if (fs.existsSync(path.join(destDir, binaryName))) {
    console.log('Destination binary already exists, skipping download...');
    return cb();
  }

  const source = architectures[system];
  const baseName = path.basename(url.parse(source).pathname);
  const destArchive = path.join(destDir, baseName);
  download(source, destArchive, function(error) {
    if (error) {
      return cb(error);
    }

    console.log('Extracting... ' + destArchive);
    if (/\.zip$/i.test(baseName)) {
      fs.createReadStream(destArchive)
        .pipe(unzipper.Extract({ path: destDir }))
        .on('error', function() { cb('Could not extract archive: ' + destArchive); })
        .on('finish', function() { cb(); });
    } else if (/\.tar\.gz$/i.test(baseName)) {
      fs.createReadStream(destArchive)
        .pipe(gunzip())
        .pipe(tar.extract(destDir))
        .on('finish', function() { cb(); });
    } else {
      cb('Unsupported archive: ' + baseName);
    }
  });
}

downloadBinary(function(error) {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});
