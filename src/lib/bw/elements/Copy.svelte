<script>
    // import { createEventDispatcher } from "svelte";

    import Swal from "sweetalert2";
    import 'sweetalert2/dist/sweetalert2.css'

    const copied = () => Swal.fire({
        icon: 'success',
        title: 'Hooray!',
        text: 'Text copied to your clipboard!'
    })

    const notCopied = () => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
    })

    export let text;

    const copy = () => {
        navigator.clipboard.writeText(text).then(
            () => copied(),
            (e) => notCopied()
        );
    };

    // const dispatch = createEventDispatcher();
    // const copy = () => {
    //     navigator.clipboard.writeText(text).then(
    //         () => dispatch("copy", text),
    //         (e) => dispatch("fail")
    //     );
    // };
</script>

<div on:click={copy} class="cursor-pointer">
    <slot />
</div>
