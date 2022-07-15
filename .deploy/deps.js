const { ssh_cmd, ssh_wrap, warn, error, success } = require('./utils')

const install_pre = async () => {
    await ssh_cmd(`apt update -y`)
    await ssh_cmd(`apt install curl -y`)
    await ssh_cmd(`apt install git -y`)
}

const install_node = async () => {
    await ssh_cmd(`curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`)
    await ssh_cmd(`apt install -y nodejs`)
    success(`node INSTALLED`)
}

const install_yarn = async () => {
    await ssh_cmd(`curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`)
    await ssh_cmd(`echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`)
    await ssh_cmd(`sudo apt update`)
    await ssh_cmd(`sudo apt install yarn`)
    success(`yarn INSTALLED`)
}

const install_pm2 = async () => {
    await ssh_cmd(`npm i -g pm2`)
    success(`pm2 INSTALLED`)
}

const install_caddy = async () => {
    await ssh_cmd(`apt install -y debian-keyring debian-archive-keyring apt-transport-https`)
    await ssh_cmd(`curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg`)
    await ssh_cmd(`curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list`)
    await ssh_cmd(`apt update`)
    await ssh_cmd(`apt install caddy`)
    await ssh_cmd(`touch /etc/caddy/Caddyfile`)
    await ssh_cmd(`sudo systemctl start caddy`)
    success(`caddy INSTALLED`)
    warn(`sudo systemctl status caddy`)
}

const install_mysql = async () => {
    await ssh_cmd(`sudo apt update`)
    await ssh_cmd(`sudo apt install -y mysql-server`)
    await ssh_cmd(`sudo systemctl start mysql.service`)
    success(`mysql INSTALLED`)
    warn(`RUN in terminal: sudo mysql_secure_installation`)
    warn(`https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04`)
}

const install_s3cmd = async () => {
    await ssh_cmd(`sudo apt install -y s3cmd`)
    warn(`RUN in terminal: s3cmd --configure`)
    success(`s3cmd INSTALLED`)
}

const process = async () => await ssh_wrap(async () => {
    await install_pre()
    await install_node()
    await install_yarn()
    await install_pm2()
    await install_caddy()
    await install_mysql()
    await install_s3cmd()
})

process()
