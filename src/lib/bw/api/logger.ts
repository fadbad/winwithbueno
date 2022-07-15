
import * as fs from 'fs';

const APP_NAME = typeof process !== 'undefined' ? process.env.APP_NAME : '---'
const FILENAME = `/tmp/${APP_NAME}_error_logs.json`

class Logger {

    constructor() {
        this.setup();
    }

    getFile(){
        return FILENAME
    }

    initialize() {
        try {
            fs.writeFileSync(FILENAME, '[]', 'utf8');
        } catch (error) {
            console.log(error);
        }
    }

    setup() {
        if(typeof window === 'undefined'){
            if (fs.existsSync(FILENAME)) {
                try {
                    const data = fs.readFileSync(FILENAME, 'utf8');
                    const content = JSON.parse(data);
                    if (!Array.isArray(content)) this.initialize();
                } catch (error) {
                    this.initialize();
                    console.log(error);
                }
            } else {
                this.initialize();
            }
        }
    }

    readLog() {
        let data = null;
        try {
            data = fs.readFileSync(FILENAME, 'utf8');
        } catch (error) {
            console.log(error);
        }
        return data;
    }

    writeLog(info) {
        const data = this.readLog();
        let arr = [];
        if (data) {
            arr = JSON.parse(data);
        }
        //add data
        if(info?.message !== 'Error: unauthorized') arr.push(info);
        //convert it back to json
        const json = JSON.stringify(arr);
        try {
            // Writing the array again
            fs.writeFileSync(FILENAME, json, 'utf8');
        } catch (error) {
            console.log(error)
        }
    }

    log(info, callback = null) {
        this.writeLog(info);
        callback && callback();
    }
};

export default new Logger()
