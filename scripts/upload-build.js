const config = require('../config/publish');
const Client = require('ssh2').Client;
const fs = require('fs');

const conn = new Client();
conn.on('ready', function() {
  console.log('Opened ssh connection');
  conn.sftp(function(err, sftp) {
    if (err) throw err;

    conn.exec('cd ' + config.targetDir + ' && rm -rf *', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        console.log('Cleaned up', config.targetDir);
        uploadBuildFiles(sftp, () => {
          conn.end();
        });
      }).on('data', function(data) {
        console.log(data);
      }).stderr.on('data', function(data) {
        console.error(data);
      });
    });
  });
}).connect({
  host: config.serverHost,
  port: config.serverPort,
  username: config.username,
  privateKey: fs.readFileSync(config.privateKey)
});

function uploadBuildFiles(sftp, cb) {
  const distPath = __dirname + '/../dist/';
  if (!fs.existsSync(distPath)) {
    console.log('No build folder present');
    cb();
    return;
  }

  let inProgress = 0;
  const checkFolder = (folder, subFolder = '') => {
    fs.readdirSync(distPath + subFolder).forEach(file => {
      // console.log(file);
      const data = fs.lstatSync(distPath + subFolder + '/' + file);
      if (data.isDirectory()) {
        // console.log('subdir:', subFolder + '/' + file);
        sftp.mkdir(config.targetDir + subFolder + '/' + file);
        checkFolder(distPath, subFolder + '/' + file);
      } else if(data.isFile()) {
        inProgress++;
        const data = fs.readFileSync(distPath + subFolder + '/' + file);
        sftp.writeFile(config.targetDir + subFolder + '/' + file, data, {}, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Uploaded', config.targetDir + subFolder + '/' + file);
          }

          inProgress--;
          if(inProgress <= 0) {
            cb();
          }
        });
        // console.log('write file:', subFolder + '/' + file);
      }
    });
  };

  checkFolder(distPath);
}
