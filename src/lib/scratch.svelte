<script>
    import { onMount, tick } from "svelte";
    import { browser } from '$app/env';

    let started = false
    let finished = false
    let isDrawing = false
    let startX = 0
    let startY = 0

    let canvas, context
    let percentage = 0

    const scratchStart = e => {
        const { layerX, layerY } = e;
        started = true
        isDrawing = true
        startX = layerX
        startY = layerY
    };

    const scratch = e => {
        const { layerX, layerY } = e;

        if (!isDrawing) return;

        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(layerX, layerY);
        context.closePath();
        context.stroke();

        startX = layerX
        startY = layerY
        const perc = getPercentage()
        if(perc >= 75){
            finished = true
            // 
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const scratchEnd = e => isDrawing = false

    const getPercentage = () => {
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;

        const nrOfPixels = data.length / 4; // rgba pixels
        let transparent = 0;

        for (let i = 3; i < data.length; i += 4) {
            transparent += data[i] ? 0 : 1;
        }

        percentage = Math.round(transparent / nrOfPixels * 100);
        return percentage
    }

    const init = async () => {
        await tick()
        canvas.addEventListener("mousedown", scratchStart);
        canvas.addEventListener("mousemove", scratch);
        canvas.addEventListener("mouseup", scratchEnd);
        canvas.addEventListener("touchstart", scratchStart);
        canvas.addEventListener("touchmove", scratch);
        canvas.addEventListener("touchend", scratchEnd);
        await reset()
    }

    const reset = async () => {
        await tick()
        started = false
        if(typeof context === 'undefined') return
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#f00";
        context.fillRect(0, 0, size, size);
        context.lineWidth = 75;
        context.lineJoin = "round";
        getPercentage()
    }

    const scroll = (enable = true) => {
        if(!browser) return
        const classes = ['h-screen', 'overflow-hidden']
        if(!enable){
            classes.forEach(c => {
                document.documentElement.classList.add(c)
                document.body.classList.add(c)
            })
        } else {
            classes.forEach(c => {
                document.documentElement.classList.remove(c)
                document.body.classList.remove(c)
            })
        }
    }

    onMount(() => {
        context = canvas.getContext("2d");
        init()
        scroll(false)
        return () => {
            console.log('unmount')
            scroll(true)
        }
    })

    const clamp = (min, max, v) => (v <= min) ? min : (v>= max) ? max : v

    $: percentage
    $: innerWidth = 0
    $: size = clamp(320, 600, innerWidth - 20)
    $: size > 0 ? reset() : null
</script>

<svelte:window bind:innerWidth />

<svelte:head>
    <title>Scratch Pad</title>
</svelte:head>

<div class="flex items-center justify-center w-screen h-screen bg-slate-800">
    <div 
        class="relative w-full aspect-square bg-slate-500 mx-auto"
        style="width: {size}px; height: {size}px;"
    >
        <div class="absolute inset-0 bg-red-600 z-10">
            <img src="https://picsum.photos/800/800" alt="" class="aspect-square object-cover w-full h-full" />
        </div>
        <canvas 
            bind:this={canvas} 
            width={size} height={size}
            class="absolute inset-0 z-20"
        />
        {#if !started}
            <div class="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <div class="font-['Pacifico'] text-white text-3xl">
                    Scratch & WIN
                </div>
            </div>
        {/if}
        <div class=" absolute top-0 left-0 w-16 h-16 rounded-br-full bg-white flex items-center justify-center shadow-md pointer-events-none z-50">
            <div class="font-bold pr-3">
                {percentage}%
            </div>
        </div>
    </div>

</div>
