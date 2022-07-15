import config from '../config'
import url from 'url'
import { exec } from './exec'

export const backupDb = async () => {
    const db = parseDbUrl(config.DATABASE_URL)
    const s3 = {
        access_key_id: config.AWS_ACCESS_KEY_ID,
        secret_access_key: config.AWS_SECRET_ACCESS_KEY,
        bucket: config.AWS_BUCKET
    }
    const ret = []

    const s3cmd = await exec('which s3cmd')
    console.log('s3cmd', s3cmd)
    ret.push(`s3cmd: ${s3cmd}`)

    const mysqldump = await exec('which mysqldump')
    console.log('mysqldump', mysqldump)
    ret.push(`mysqldump: ${mysqldump}`)

    const filename = `db-backup-${db.database}-${Date.now()}.sql.gz`
    const file = `/tmp/${filename}`
    console.log(file)
    ret.push(`FILE: ${file}`)

    await exec(`${mysqldump} -h ${db.host} -u ${db.username} -p${db.password} ${db.database} | gzip > ${file}`)
    console.log(`DONE mysqldump`)
    ret.push(`DONE mysqldump`)

    await exec(`${s3cmd} --access_key ${s3.access_key_id} --secret_key=${s3.secret_access_key} put ${file} s3://${s3.bucket}/backup/db/${filename}`)
    console.log(`DONE s3cmd`)
    ret.push(`DONE s3cmd`)

    await exec(`rm -f ${file}`)
    console.log(`DONE`)
    ret.push(`DONE`)

    return ret
}

export const parseDbUrl = (dbUrl) => {
    
    var parsed:any = url.parse(dbUrl, true)
    if (parsed.auth) {
        var auth = parsed.auth.split(':')
        parsed.user = auth[0];
        parsed.password = auth[1];
    }
    var adapter = parsed.protocol.replace(':', '')
    var database = parsed.pathname;
  
    // Trim leading slash for non-sqlite3 databases
    if (adapter !== 'sqlite3' && database) {
        var database = database.substring(1)
    }
  
    if (parsed.port) {
        var port = parseInt(parsed.port, 10)
        if (isNaN(port)) port = void(0)
    }
  
    var config = {
        adapter:  adapter,
        host:     parsed.hostname,
        port:     port,
        database: database,
        username: parsed.user,
        password: parsed.password
    }
  
    for (var k in parsed.query) config[k] = parsed.query[k]
  
    return config;
}
