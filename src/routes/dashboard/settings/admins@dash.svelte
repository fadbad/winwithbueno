<script>
    import { Table, Template, Form }  from "$lib/bw";

    let url = '/admins'
    let form, table

    let columns = [
        // { name: "id", sortable: true },
        { name: "avatar"},
        { name: "name", sortable: true },
        { name: "email", sortable: true },
        { name: 'dates-auth', sortable: 'createdAt' },
        { name: 'edit', onclick: i => form.onEdit(i) },
        { name: 'delete', onclick: i => form.onDelete(i) },
    ]

    let schema = [
        {
            type: 'text',
            name: 'name',
        },
        {
            type: 'email',
            name: 'email',
        },
        {
            type: 'password',
            name: 'password',
        },
    ]


</script>
<Template title="Admins">
    
    <Table bind:this={table} url={url} columns={columns} />
    
    <Form 
        bind:this={form}
        {schema}
        {url}
        on:delete={ev => table.onDelete(ev?.detail?.item)}
        on:post={ev => table.onAdd(ev?.detail?.item)}
        on:patch={ev => table.onEdit(ev?.detail?.item)}
    />
    
</Template>
