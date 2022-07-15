<script>
    import 'sweetalert2/dist/sweetalert2.css'
</script>

<div data-theme="winter" class="min-h-screen">
    <slot />
</div>

<style>
    /* @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'); */

    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap');

    :global( * ) {
        /* font-family: 'Inter', sans-serif; */
        font-family: 'Source Sans Pro', sans-serif;
    }

    :global(:focus-visible) {
        outline: none;
    }

    :global(.input) {
        transition: all 0.1s linear;
    }

    :global(.input:focus) {
        outline-offset: 0px !important;
    }
</style>
