class BaseFilterLine {

    async Show(model) {
        let result = '';
        for (const [key, value] of Object.entries(model)) {
            if (value != null) {
                let translatedKey = key;
                if (this.translation.has(key)) {
                    translatedKey = this.translation.get(key);
                }

                result += `<span class='filter-line-cell'><b>${translatedKey}</b>: ${value}</span>`;
            }
        }

        if (result === null || result === '') {
            $('#FilterBlock').empty();
        } else {
            $('#FilterBlock').html(`Filters applied: ${result}`);
        }
    }

    parseResponse(response, id) {
        // '[{'k':'','c':'All'},{'k':'0','c':'Invalid'},{'k':'1','c':'Buy'},{'k':'2','c':'Sell'}]'
        let result = [];
        for (const [num, record] of Object.entries(response)) {
            let founded = false;
            for (const [key, value2] of Object.entries(record)) {
                if (founded) {
                    result.push(value2);
                    founded = false;
                    continue;
                }

                if (typeof (id) === 'number') {
                    if (value2 == id.toString()) {
                        founded = true;
                        continue;
                    }
                }
                else if (typeof (id) === 'object') {
                    if (id.includes(Number.parseInt(value2, 10))) {
                        founded = true;
                        continue;
                    }
                }
            }
        }

        return result.join(', ');
    }

    async formatCellAsync(url, value) {
        let result;

        try {
            result = await $.ajax({
                url: url,
                type: 'GET'
            });
            return this.parseResponse(result, value);
        } catch (error) {
            return value;
        }
    }

    formatDate(date) {
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();

        return [date.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
        ].join('-');
    }
}