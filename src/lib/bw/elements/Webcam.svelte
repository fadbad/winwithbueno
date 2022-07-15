<script type="ts">
    import { onMount, tick, createEventDispatcher } from "svelte";
    import { Icon } from "$lib/bw";
    const dispatch = createEventDispatcher();

    interface ScreenshotDimensions {
        width: number;
        height: number;
    }

    let canvas = null 
    let ctx: any = null 
    let requestUserMediaId = 0
    let unmounted = false 
    let stream 
    let video 
    let src 
    let hasUserMedia = false
    let shot = null

    export let textUse: string = 'Use Photo'
    export let textRetake: string = 'Retake'
    export let width: number = 1280
    export let height: number = 720
    export let facingMode: 'user' | 'environment' = 'environment'

    export let audio: boolean = false
    export let forceScreenshotSourceSize: boolean = false
    export let imageSmoothing:  boolean = true
    export let mirrored: boolean = false
    export let onUserMedia: (stream: MediaStream) => void = () => undefined
    export let onUserMediaError: (error: string | DOMException) => void = () => undefined
    export let screenshotFormat: "image/webp" | "image/png" | "image/jpeg" = "image/jpeg"
    export let screenshotQuality: number = 0.92
    export let videoConstraints: MediaStreamConstraints["video"] = {
        width,
        height,
        facingMode
    }
    export let audioConstraints: MediaStreamConstraints["audio"] = null
    export let minScreenshotHeight: number = null;
    export let minScreenshotWidth: number = null;
    export let style = ""

    const videoStyle = mirrored ?  `${style}; transform: scaleX(-1);` : style;

    (function polyfillGetUserMedia() {
        if (typeof window === 'undefined') {
            return;
        }

        if (navigator.mediaDevices === undefined) {
            (navigator as any).mediaDevices = {};
        }

        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
                const getUserMedia =
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;

                if (!getUserMedia) {
                    return Promise.reject(
                        new Error("getUserMedia is not implemented in this browser")
                    );
                }

                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }
    })()

    const hasGetUserMedia = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

    const stopMediaStream = (stream: MediaStream | null) => {
        if (stream) {
            if (stream.getVideoTracks && stream.getAudioTracks) {
                stream.getVideoTracks().map(track => {
                    stream.removeTrack(track);
                    track.stop();
                });
                stream.getAudioTracks().map(track => {
                    stream.removeTrack(track);
                    track.stop()
                });
            } else {
                ((stream as unknown) as MediaStreamTrack).stop();
            }
        }
    }

    const stopAndCleanup = () => {
        if (hasUserMedia) {
            stopMediaStream(stream);
            if (src) window.URL.revokeObjectURL(src);
        }
    }

    const getScreenshot = (screenshotDimensions?: ScreenshotDimensions) => {
        if (!hasUserMedia) return null;
        const canvas = getCanvas(screenshotDimensions);
        const screenshot = (canvas && canvas.toDataURL(screenshotFormat, screenshotQuality));
        shot = screenshot
    }

    const useScreenshot = () => {
        dispatch('screenshot', shot)
    }

    const clearScreenshot = () => {
        shot = null
    }

    const getCanvas = (screenshotDimensions?: ScreenshotDimensions) => {

        if (!video) return null;

        if (!hasUserMedia || !video.videoHeight) return null;

        if (!ctx) {
            let canvasWidth = video.videoWidth;
            let canvasHeight = video.videoHeight;
            if (!forceScreenshotSourceSize) {
                const aspectRatio = canvasWidth / canvasHeight;
                canvasWidth = minScreenshotWidth || video.clientWidth;
                canvasHeight = canvasWidth / aspectRatio;

                if ( minScreenshotHeight && canvasHeight < minScreenshotHeight) {
                    canvasHeight = minScreenshotHeight;
                    canvasWidth = canvasHeight * aspectRatio;
                }
            }

            canvas = document.createElement("canvas");
            canvas.width = screenshotDimensions?.width ||  canvasWidth;
            canvas.height = screenshotDimensions?.height || canvasHeight;
            ctx = canvas.getContext("2d");
        }


        if (ctx && canvas) {
            // mirror the screenshot
            if (mirrored) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }

            ctx.imageSmoothingEnabled = imageSmoothing;
            ctx.drawImage(video, 0, 0, screenshotDimensions?.width || canvas.width, screenshotDimensions?.height || canvas.height);

            // invert mirroring
            if (mirrored) {
                ctx.scale(-1, 1);
                ctx.translate(-canvas.width, 0);
            }
        }

        return canvas;
    }

    const requestUserMedia = () => {

        const sourceSelected = (
            __audioConstraints: boolean | MediaTrackConstraints | undefined,
            __videoConstraints: boolean | MediaTrackConstraints | undefined,
        ) => {
            const constraints: MediaStreamConstraints = {
                video: __videoConstraints !== null ? __videoConstraints : true
            };

            if (audio) {
                constraints.audio = __audioConstraints !== null ? __audioConstraints : true;
            }

            requestUserMediaId++
            const myRequestUserMediaId = requestUserMediaId

            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                    if (unmounted || myRequestUserMediaId !== requestUserMediaId) {
                        stopMediaStream(stream);
                    } else {
                        handleUserMedia(null, stream);
                    }
                })
                .catch(e => handleUserMedia(e) );
        };

        if ("mediaDevices" in navigator) {
            sourceSelected(audioConstraints, videoConstraints);
        } else {
            const optionalSource = (id: string | null) => ({ optional: [{ sourceId: id }] }) as MediaTrackConstraints;

            const constraintToSourceId = (constraint) => {
                const { deviceId } = constraint;

                if (typeof deviceId === "string") {
                    return deviceId;
                }

                if (Array.isArray(deviceId) && deviceId.length > 0) {
                    return deviceId[0];
                }

                if (typeof deviceId === "object" && deviceId.ideal) {
                    return deviceId.ideal;
                }

                return null;
            };

            // @ts-ignore: deprecated api
            MediaStreamTrack.getSources(sources => {
                let audioSource: string | null = null;
                let videoSource: string | null = null;

                sources.forEach((source: MediaStreamTrack) => {
                    if (source.kind === "audio") {
                        audioSource = source.id;
                    } else if (source.kind === "video") {
                        videoSource = source.id;
                    }
                });

                const audioSourceId = constraintToSourceId(audioConstraints);
                if (audioSourceId) {
                    audioSource = audioSourceId;
                }

                const videoSourceId = constraintToSourceId(videoConstraints);
                if (videoSourceId) {
                    videoSource = videoSourceId;
                }

                sourceSelected(
                    optionalSource(audioSource),
                    optionalSource(videoSource)
                );
            });
        }
    }

    const handleUserMedia = (err, stream = null) => {

        if (err || !stream) {
            hasUserMedia = false;
            onUserMediaError(err);
            return;
        }

        try {
            if (video) {
                video.srcObject = stream;
            }
            hasUserMedia = true
        } catch (error) {
            hasUserMedia = true
            src = window.URL.createObjectURL(stream)
        }

        onUserMedia(stream);
    }

    onMount(async () => {
        await tick()
        if(!hasGetUserMedia()){
            alert('no')
            onUserMediaError("getUserMedia not supported")
            return
        }

        if(!hasUserMedia){
            requestUserMedia()
        }

        return () => {
            unmounted = true
            stopAndCleanup()
        }
    })
</script>
<div class="relative">
    <div class="absolute inset-0 flex items-center justify-center z-0 text-white">
        <Icon name="refresh" spin={true} class="-mt-2" />
    </div>
    <video
        autoPlay
        src={src}
        muted={!audio}
        playsInline
        bind:this={video}
        style={videoStyle}
        class="relative rounded"
    />

    {#if shot}
        <div class="absolute inset-0">
            <img src={shot} alt="" class="w-full rounded" />
        </div>
    {/if}
    
    <div class="absolute bottom-0 left-0 right-0 flex items-center justify-center bg-gradient-to-b from-transparent to-[#00000090] rounded">
        <div class="flex justify-center mt-6">
            {#if shot}
                <div class="flex items-center mb-6">
                    <a href="#!" class="mx-6 inline-block text-white" on:click|preventDefault={useScreenshot}>{textUse}</a>
                    <a href="#!" class="mx-6 inline-block text-white" on:click|preventDefault={clearScreenshot}>{textRetake}</a>
                </div>
            {:else}
                <div 
                    on:click={() => getScreenshot()}
                    class="w-[54px] h-[54px] rounded-full mb-3 border-2 border-white flex items-center justify-center"
                >
                    <div class="w-[40px] h-[40px] bg-white rounded-full"></div>
                </div>
            {/if}
        </div>
    </div>
</div>
