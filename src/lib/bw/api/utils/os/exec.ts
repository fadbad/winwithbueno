import cp from 'child_process'

export const exec = (command) => {
    return new Promise(function (resolve) {
        var runCommand = 'LC_ALL="en_US.UTF-8";LANG="en_US.UTF-8";LANGUAGE="en_US:en";' + command
    
        cp.exec(runCommand, { shell: true }, function (err, stdout, stderr) {
            if (err || !stdout) {
                return resolve('not-supported')
            }
        
            return resolve(stdout)
        })
    })
}

export const wrapExec = function(command){
    return function(){
        return exec(command)
    }
}
