<script>
    export let data = [];

    const TableToExcel = function(){}

    TableToExcel.prototype = {
        
        render: function(param, title) {
            this.createExcel(param, title)
        },
        
        createTable: function(param, title) {
            var trLen = param.length;
            var tdLen = param[0].length;
            var trArr = [];
            var style = 'mso-number-format:"\@"';
            if (title) {
                var hdLen = title.length;
                for (var n = 0; n < hdLen; n++) {
                    var border = n % 2 != 0 ? "border-top:1px solid #fff;" : "";
                    trArr.push('<tr><td style="background:'+title[n].bg+'; color:'+title[n].color+';" colspan="' + param[0].length + '">' + title[n].text + '</td></tr>');
                }
            }
            for (var i = 0; i < trLen; i++) {
                var tdArr = [];
                for (var o = 0; o < tdLen; o++) {
                    var tdHtml = '<td style=' + style + '>' + param[i][o] + '</td>';
                    tdArr.push(tdHtml);
                }
                var trHtml = '<tr>' + tdArr.join("") + '</tr>';
                trArr.push(trHtml);
            }
            return trArr.join("");
        },
        
        createExcel: function(param, title) {
            var self = this;
            var tableHtml = null;
            var func = (function() {
                var uri = 'data:application/vnd.ms-excel;base64,';
                var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>td{mso-number-format:"\@";}</style></head><body><table>{table}</table></body></html>`;
                var base64 = function(s) {
                    return window.btoa(unescape(encodeURIComponent(s)))
                };
                var format = function(s, c) {
                    return s.replace(/{(\w+)}/g, function(m, p) {
                        return c[p];
                    })
                }
                return function(table, name) {
                    if (typeof(param) == "string") {
                        tableHtml = document.getElementById(param).innerHTML;
                    } else {
                        tableHtml = self.createTable(param, title);
                    }
                    var ctx = {
                        worksheet: name || 'Worksheet',
                        table: tableHtml
                    }
                    var link = document.createElement("a");
                    link.href = uri + base64(format(template, ctx));
                    link.download = 'rcg-download.xls';
                    document.body.appendChild(link)
                    link.click();
                }
            })();
            func()
        },
    }

    
    const run = () => {
        const toExcel = new TableToExcel()
        toExcel.render(data)
    }

</script>

<div on:click={run} class="cursor-pointer">
    <slot />
</div>
