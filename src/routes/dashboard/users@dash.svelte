<script>
    import { Table, Template, TableToggle, PanelRight, __date_item }  from "$lib/bw";
    import moment from 'moment'

    let table, url = '/users'

    const basename = path => {
        if(!path) return ''
        // const str = path.split('/').reverse()[0]
        var base = new String(path).substring(path.lastIndexOf('/') + 1); 
        if(base.lastIndexOf(".") !== -1) base = base.substring(0, base.lastIndexOf("."));
        return base;
    }

    let columns = [
        // { name: "id", sortable: true },
        // {name: 'avatar'}, 
        { name: "", value: i => (`
            <img src=${i.baseAvatar} class="w-14 min-w-[3.5rem] h-14 rounded-full object-cover" alt="" />    
        `) },
        { name: "name", sortable: true, info: true },
        { name: "email", sortable: true },
        { name: "mobile", sortable: true },
        { name: 'info', value: i => (`
            ${i.dob ? `<div><span class="text-xs text-slate-400">DOB:</span> ${moment(i.dob).format('DD MMM, YY')}</div>` : ''}
            <div><span class="text-xs text-slate-400">Gender:</span> ${i.gender}</div>
            <div><span class="text-xs text-slate-400">Outlet:</span> ${i.outlet}</div>
            <div><span class="text-xs text-slate-400">City:</span> ${i.city}</div>
            <div><span class="text-xs text-slate-400">Activate SMS/Email:</span> ${i.sms ? 'Yes' : 'No'}</div>
        `) },
        { name: 'barcode', value: i => (`
            ${i.barcode ? `<div>${i.barcode}</div>` : ''}
            <a href="${i.imageUrl}" target="_blank">
                <img src=${i.imageUrl} class="w-14 h-14 max-w-14" alt="" />
            </a>
        `)},
        { name: 'prize', value: i => (`
            <div><span class="text-xs text-slate-400">Prize:</span> ${i.prize}</div>
            <div><span class="text-xs text-slate-400">Code:</span> ${basename(i.prizeCode)}</div>
        `)},
        // { name: "Verified?", component: TableToggle, componentProps: (i) => ({
        //     table: 'user',
        //     field: 'verified',
        //     id: i.id,
        //     value: i.verified
        // })},
        { name: 'dates', sortable: 'createdAt'},
        // { name: 'delete', onclick: i => console.log('delete', i) },
    ]
</script>
<Template title="Users">
    <Table 
        bind:this={table}
        url={url} 
        columns={columns} 
    />
</Template>
