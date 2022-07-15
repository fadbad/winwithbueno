const {
    exec, path, ssh_cmd, ssh_wrap, ssh_file, ssh_dir, warn, error, success, tar
} = require('./utils')

const { appName, port, socket_port, deploys_to_keep, install_deps, npm } = require('./config')

const dir = path.dirname( __dirname)

const dat = new Date().getTime()
const remote_tmp = `/tmp/${appName}/${dat}`
const remote_releases = `/home/sites/${appName}/releases`
const remote_current = `/home/sites/${appName}/current`
const remote_dir = `/home/sites/${appName}/releases/${dat}`

const transfers = {
    files: [
        {
            local: `${dir}/package.json`,
            remote: `${remote_tmp}/package.json`
        },
        {
            local: `${dir}/.env.prod`,
            remote: `${remote_tmp}/.env`
        },
        {
            local: `${dir}/build.tar.gz`,
            remote: `${remote_tmp}/build.tar.gz`
        }
    ],
    dirs: [
        {
            local: `${dir}/prisma`,
            remote: `${remote_tmp}/prisma`
        }
    ]
}

const build = async () => {
    warn('building...')
    await exec(`cd ${dir} && npm run build`)
    success('app built')
}

const zip = async () => {
    await tar(`${dir}/build`, `${dir}/build.tar.gz`)
    warn('ZIP completed');
}

const process = async () => await ssh_wrap(async () => {
    await build()
    await zip()

    await ssh_cmd(`mkdir -p ${remote_tmp}`)
    await ssh_cmd(`mkdir -p ${remote_dir}`)

    for (const file of transfers.files) {
        warn(`SENDING: ${file.local}`)
        await ssh_file(file.local, file.remote)
    }

    for (const dir of transfers.dirs) {
        warn(`SENDING DIR: ${dir.local}`)
        await ssh_dir(dir.local, dir.remote)
    }

    await ssh_cmd(`cp -R ${remote_tmp}/. ${remote_dir}/`)
    success(`copied to ${remote_dir}`)
    await ssh_cmd(`rm -rf /tmp/${appName}`)
    warn('TMP deleted')

    warn(`UNZIPPING build`)
    await ssh_cmd(`cd ${remote_dir} && mkdir -p build`)
    await ssh_cmd(`cd ${remote_dir} && tar -xf build.tar.gz -C build`)
    success('UNZIPPED')

    if(install_deps){
        warn(`installing dependencies`)
        // await ssh_cmd(`cd ${remote_dir} && ${npm} install --production`)
        await ssh_cmd(`cd ${remote_dir} && ${npm} install`)
        success(`${npm} done`)
    }

    warn(`PRISMA MIGRATE`)
    await ssh_cmd(`cd ${remote_dir} && npx prisma migrate deploy`)
    success(`PRISMA MIGRATE DONE`)

    warn(`creating release`)
    await ssh_cmd(`rm ${remote_current}`)
    await ssh_cmd(`ln -sf ${remote_dir} ${remote_current}`)
    success(`Symbolic link created at: ${remote_current} for ${remote_dir}`)

    warn(`PM2`)
    await ssh_cmd(`pm2 stop --silent ${appName}`)
    await ssh_cmd(`pm2 delete --silent ${appName}`)
    await ssh_cmd(`PORT=${port} pm2 start ${remote_current}/build/index.js --name ${appName}`)
    warn(`PM2 done: ${appName}`)

    // const socketAppName = `${appName}-socket`
    // await ssh_cmd(`pm2 stop --silent ${socketAppName}`)
    // await ssh_cmd(`pm2 delete --silent ${socketAppName}`)
    // await ssh_cmd(`PORT=${socket_port} pm2 start ${remote_current}/build/static/socket-server.js --name ${socketAppName}`)
    // warn(`PM2 SOCKET done: ${socketAppName}`)

    // CLEAN OLD RELEASES
    await ssh_cmd(`cd ${remote_releases} && ls`, async res => {
        const dirs = res ? res.split('\n') : []
        warn(`${dirs.length} releases found`)
        if(dirs.length > deploys_to_keep){
            const n = dirs.length - deploys_to_keep
            for(let i = 0; i < n; i++){
                await ssh_cmd(`rm -rf ${remote_releases}/${dirs[i]}`)
                warn(`deleted: ${remote_releases}/${dirs[i]}`)
            }
        }
    })

    warn(`REMOVING BUILD`)
    await exec(`cd ${dir} && rm -rf build`)
    await exec(`cd ${dir} && rm -rf build.tar.gz`)
    success(`build removed`)
})

process()
