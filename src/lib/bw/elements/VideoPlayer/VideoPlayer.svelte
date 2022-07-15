<script lang="ts">
  import VideoPlayerClient from './VideoPlayerClient.svelte';
  import VideoPlayerServer from './VideoPlayerServer.svelte';

  let isClient = typeof window !== 'undefined' ? true : false;

  export let width:any = 1920;
  export let height:any = 1080;
  export let poster = '';
  export let source = '';
  export let controlsHeight = '55px';
  export let trackHeight = '3px';
  export let thumbSize = '15px';
  export let centerIconSize = '64px';
  export let playerBgColor = 'black';
  export let color = '#FF0000';
  export let focusColor = 'white';
  export let barsBgColor = 'white';
  export let iconColor = 'white';
  export let bufferedColor = '#FF9600';
  export let chunkBars = false;
  export let borderRadius = '4px';
  export let loop = false;
  export let skipSeconds = 5;
  export let controlsOnPause = true;
  export let timeDisplay = true;

  $: _width = parseInt(width);
  $: _height = parseInt(height);
  $: aspectRatio = _height / _width;
</script>

{#if isClient}
  <VideoPlayerClient
    {width}
    {height}
    {poster}
    {source}
    {controlsHeight}
    {trackHeight}
    {thumbSize}
    {centerIconSize}
    {playerBgColor}
    {color}
    {focusColor}
    {barsBgColor}
    {iconColor}
    {bufferedColor}
    {chunkBars}
    {borderRadius}
    {loop}
    {skipSeconds}
    {aspectRatio}
    {controlsOnPause}
    {timeDisplay} />
{:else}
  <VideoPlayerServer {playerBgColor} {borderRadius} {aspectRatio} />
{/if}
