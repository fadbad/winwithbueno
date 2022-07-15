// https://github.com/steelbrain/node-ssh
const path = require('path')
const { promisify } = require('util');
const _exec = promisify(require('child_process').exec);
const { tar, zip } = require('./utils-zip')

const { NodeSSH } = require('node-ssh')
const chalk = require('chalk') // yarn add chalk@4.1.2;
const ssh = new NodeSSH()

const { remote } = require('./config')

const warn = (str, more) => console.log(chalk.yellow(str, more))
const error = (str, more) => console.log(chalk.red(str, more))
const success = (str, more) => console.log(chalk.green(str, more))

const exec = async (cmd) => {
    const res = await _exec(cmd)
    console.log(res.stdout.trim())
}

const ssh_wrap = async (fn) => {
    try {
        await ssh.connect(remote)
        success('Remote connection ON')

        await fn()

        ssh.dispose()

    } catch (err) {
        error('HA', err)
    }
}

const ssh_cmd = async (cmd, fn) => {
    const res = await ssh.execCommand(cmd)
    if(res.code) {
        error(res.code, res.stderr)
    }
    if(res.stdout){
        success(res.stdout)
        fn && await fn(res.stdout)
    }
}

const ssh_file = async (local, remote) => {
    try {
        await ssh.putFile(local, remote)
        success(`${local} INSTALLED`)
    } catch (err) {
        error(`${local} FAILED`)
        console.log(err)
    }
}

const ssh_dir = async (local, remote) => {
    const failed = []
    const successful = []
    try {
        const status = await ssh.putDirectory(local, remote, {
            recursive: true,
            // concurrency: 10,
            validate: function(itemPath) {
                const baseName = path.basename(itemPath)
                return baseName.substr(0, 1) !== '.' && // do not allow dot files
                        baseName !== 'node_modules' // do not allow node_modules
            },
            tick: function(localPath, remotePath, err) {
                if (err) {
                    failed.push(localPath)
                    error(remotePath)
                } else {
                    successful.push(localPath)
                    success(remotePath)
                }
            }
        })
        if(status){
            success(`${local} TRANSFER WAS SUCCESSFUL`)
        } else {
            error(`${local} TRANSFER WAS UNSUCCESSFUL`)
            console.log('failed transfers', failed.join(', '))
        }
    } catch (err) {
        error(`${local} FAILED`)
        console.log(err)
    }
}

module.exports = {
    path, 
    promisify,
    ssh, 
    exec, 
    ssh_cmd, 
    ssh_wrap, 
    ssh_file, 
    ssh_dir, 
    warn, 
    error, 
    success,
    tar,
    zip,
}
