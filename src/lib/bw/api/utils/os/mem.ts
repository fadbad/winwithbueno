import * as fs from "fs";
import * as os from "os";
import { wrap, isNumber } from "./util";
import { exec } from "./exec";

var linuxFreeMemory = function () {
  return new Promise(function (resolve) {
    fs.readFile("/proc/meminfo", "utf8", function (err, out) {
      if (err) {
        return resolve("not-supported");
      }
      var memInfo: any = {};
      var usage = out.toString().trim().split("\n");
      usage.forEach((line) => {
        var pair = line.split(":");
        memInfo[pair[0]] = parseInt(pair[1], 10);
      });

      var totalMem = parseInt(memInfo.MemTotal, 10) * 1024;

      // check if MemAvailable exists
      if (!memInfo.MemAvailable) {
        memInfo.MemAvailable =
          memInfo["MemFree"] +
          memInfo["Buffers"] +
          memInfo["Cached"] +
          memInfo["SReclaimable"] -
          memInfo["Shmem"];
      }
      var freeMem = memInfo.MemAvailable * 1024;

      if (os.release() < "3.14") {
        freeMem =
          ((memInfo.MemFree || 0) +
            (memInfo.Buffers || 0) +
            (memInfo.Cached || 0)) *
          1024;
      }

      return resolve({ totalMem, freeMem });
    });
  });
};

var osxFreeMemory = wrap(function* () {
  var totalMem = os.totalmem();
  var mappings = {
    "Pages purgeable": "purgeable",
    "Pages wired down": "wired",
    "Pages active": "active",
    "Pages inactive": "inactive",
    "Pages occupied by compressor": "compressed",
  };
  var [vmStat, pagePageable] = yield Promise.all([
    exec("vm_stat"),
    exec("sysctl vm.page_pageable_internal_count"),
  ]);

  vmStat = vmStat.toString().trim();
  pagePageable = pagePageable.toString().trim();

  // get page size
  var pageSize = 4096;
  var matchdPageSize = /page size of (\d+) bytes/.exec(vmStat);

  if (matchdPageSize && isNumber(matchdPageSize[1])) {
    pageSize = Number(matchdPageSize[1]);
  }

  // get page pageable
  var [, pageableValue] = pagePageable.split(":");

  if (!isNumber(pageableValue)) {
    return {
      totalMem,
      freeMem: os.freemem(),
    };
  }

  pageableValue = Number(pageableValue) * pageSize;

  // get vm stats
  var lines = vmStat.split("\n").filter((x) => x !== "");
  var stats: any = {};

  lines.forEach((x) => {
    var parts = x.split(":");
    var key = parts[0];
    var val = parts[1].replace(".", "").trim();

    if (mappings[key]) {
      var ky = mappings[key];
      stats[ky] = val * pageSize;
    }
  });

  // get app memory
  var appMemory = pageableValue - stats.purgeable;
  // get wired memory
  var wiredMemory = stats.wired;
  // get compressed memory
  var compressedMemory = stats.compressed;
  var used = appMemory + wiredMemory + compressedMemory;

  return {
    totalMem,
    freeMem: totalMem - used,
  };
});

export default {
  info: wrap(function* () {
    var totalMem = null;
    var freeMem = null;
    var memInfo = yield linuxFreeMemory();

    if (memInfo === "not-supported") {
      totalMem = os.totalmem();
      freeMem = os.freemem();
      if (os.platform() === "darwin") {
        var mem = yield osxFreeMemory();
        totalMem = mem.totalMem;
        freeMem = mem.freeMem;
      }
    } else {
      totalMem = memInfo.totalMem;
      freeMem = memInfo.freeMem;
    }

    var totalMemMb = parseFloat((totalMem / 1024 / 1024).toFixed(2));
    var usedMemMb = parseFloat(((totalMem - freeMem) / 1024 / 1024).toFixed(2));
    var freeMemMb = parseFloat((totalMemMb - usedMemMb).toFixed(2));
    var usedMemPercentage = parseFloat(
      (100 * ((totalMem - freeMem) / totalMem)).toFixed(2)
    );
    var freeMemPercentage = parseFloat((100 * (freeMem / totalMem)).toFixed(2));

    return {
      totalMemMb: totalMemMb,
      usedMemMb: usedMemMb,
      freeMemMb: freeMemMb,
      usedMemPercentage: usedMemPercentage,
      freeMemPercentage: freeMemPercentage,
    };
  }),
  free: function () {
    var self = this;

    return self.info().then(function (res) {
      return Promise.resolve({
        totalMemMb: res.totalMemMb,
        freeMemMb: res.freeMemMb,
      });
    });
  },
  used: function () {
    var self = this;

    return self.info().then(function (res) {
      return Promise.resolve({
        totalMemMb: res.totalMemMb,
        usedMemMb: res.usedMemMb,
      });
    });
  },
  totalMem: function () {
    return os.totalmem();
  },
};
