export const scrollToTop = () => window.scroll({top: 250, behavior: 'smooth'})

export const scrollToID = (id) => {
    const el = document.getElementById(id);
    const y = el.getBoundingClientRect().top + window.scrollY;
    setTimeout(() => window.scroll({top: y - 80, behavior: 'smooth'}), 100)
}

export const s3 = path => 'https://lays.eu-central-1.linodeobjects.com'+path;

export const randomObj = items => items[Math.floor(Math.random()*items.length)]

export const weightedRandom = (arr) => {
    
    const weights = arr.map(i => i?.weight || 0)

    // scan weights array and sum valid entries
    var sum = 0;
    var val;
    for (var weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
        val = weights[weightIndex];
        if (val > 0) sum += val;
    }

    // select a value within range
    var selected = Math.random() * sum;

    // find array entry corresponding to selected value
    var total = 0;
    var lastGoodIdx = -1;
    var chosenIdx;
    for (weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
        val = weights[weightIndex];
        total += val;
        if (val > 0) {
            if (selected <= total) {
                chosenIdx = weightIndex;
                break;
            }
            lastGoodIdx = weightIndex;
        }

        // handle any possible rounding error comparison to ensure something is picked
        if (weightIndex === (weights.length - 1)) {
            chosenIdx = lastGoodIdx;
        }
    }

    return arr[chosenIdx];
};

export const englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
export const arabicNumbers  = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"];
export const a2e = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
export const e2a = value => {
	if (!value) return;
	value=value.toString();
	for (var i = 0; i < arabicNumbers.length; i++) {
		value = value.replace(new RegExp(englishNumbers[i], "g"), arabicNumbers[i]);
	}
	return value;
}

export const validURL = (url) => {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

export const validEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const validPhone = (num) => {
    if(!num) return false;
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if(re.test(num)){
        return true
    } else {
        return /^\d{8,16}$/.test(num)
    }
}

export const validBarcode = (num) => {
    if(!num) return false;
    return /^\d{8,13}$/.test(num)
}
