import cpu from './cpu'
import drive from './drive'
import mem from './mem'
import os from './os'

export const getSysDetails = async () => {
    const platform = cpu.model();
    const operatingSystem = await os.oos();
    const ip = os.ip();
    const osType = os.type();
    const arch = os.arch();
    const cpuAverage = cpu.average();
    const cpuCount = cpu.count()
    const cpuLoadavg = cpu.loadavg()
    const cpuLoadavgTime = cpu.loadavgTime()
    const cpuUsed = await cpu.usage();
    const cpuFree = await cpu.free();
    const memUsed = await mem.used();
    const memFree = await mem.free();
    const driveInfo = await drive.info();
    const memUsedPercentage = (memUsed.usedMemMb / memUsed.totalMemMb) * 100;
    const memFreePercentage = (memFree.freeMemMb / memFree.totalMemMb) * 100;

    return {
        system: {
            platform,
            operatingSystem,
            ip,
            osType,
            arch,
        },
        cpu: {
            count: cpuCount,
            loadAvg: cpuLoadavg,
            loadAvgTime: cpuLoadavgTime,

            usedPerc: cpuUsed,
            freePerc: cpuFree,
            average: cpuAverage,
        },
        memory: {
            usedGB: memUsed.usedMemMb / 1024,
            usedPerc: memUsedPercentage,
            freeGB: memFree.freeMemMb / 1024,
            freePerc: memFreePercentage,
            totalGB: memFree.totalMemMb / 1024
        },
        drive: {
            usedGB: driveInfo.usedGb,
            usedPerc: driveInfo.usedPercentage,
            freeGB: driveInfo.freeGb,
            freePerc: driveInfo.freePercentage,
            totalGB: driveInfo.totalGb
        },
    };
}

export default {
    cpu,
    drive,
    mem,
    os
}
