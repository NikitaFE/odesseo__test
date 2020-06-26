class DataTable {
    constructor(id, url, asc, desc, minRaws, maxRaws, defaultRaws) {
        this.id = id;
        this.url = url;
        this.asc = asc;
        this.desc = desc;
        this.minRaws = minRaws;
        this.maxRaws = maxRaws;
        this.defaultRaws = defaultRaws;
        this.$flag = true;
        this.$root = document.getElementById(this.id);
        this.$pagination = '';
        
        this.load(this.url, this.asc);
    }

    renderTable(data) {
        let mainTable = document.createElement('table');
        let headRaw = document.createElement('thead');
        let tableBody = document.createElement('tbody');
        mainTable.className = 'table';
        headRaw.className = 'table__head';
        tableBody.className = 'table__body';
        headRaw.innerHTML = '<tr class="table__head-raw"><th class="table__head-data">id</th><th class="table__head-data">название</th><th class="table__head-data">город</th><th class="table__head-data">номер отделения <a class="table__sort">⮟</a></th></tr>';
        mainTable.append(headRaw);
        let tableData = '';

        data.forEach(el => {
            tableData += `<tr class="table__body-raw">
                            <td class="table__body-data">${el.ref}</td>
                            <td class="table__body-data">${el.name}</td>
                            <td class="table__body-data">${el.city}</td>
                            <td class="table__body-data">${el.number}</td>
                        </tr>`;
        })

        tableBody.innerHTML = tableData;
        mainTable.append(tableBody);

        return mainTable;
    }

    sortByNumber()  {
        const sortBtn = document.querySelector('.table__sort');

        sortBtn.addEventListener('click', () => {
            this.$root.innerHTML = '';

            if (this.$flag) {
                this.load(this.url, this.desc);
            } else {
                this.load(this.url, this.asc);
            }

            this.$flag = !this.$flag;
        })
    }

    changeLimit() {
        const select = document.querySelector('#select');
        select.addEventListener('change', () => {
            this.defaultRaws = select.value;
            this.$pagination.remove();
            this.renderPagination(this.defaultRaws);
        })
    }

    renderSelect(min, max, defaultValue)  {
        const select = document.createElement('select');
        select.id = 'select';
        select.className = 'select';
        let options = '';

        for (let i = min; i <= max; i++) {
            if (i === defaultValue) {
                options += `<option class="select__option" value="${i}" selected>${i}</option>`;
            } else {
                options += `<option class="select__option" value="${i}">${i}</option>`;
            }
        }

        select.innerHTML = options;

        return select;
    }

    renderPagination(raws) {
        $('.table tbody').paginathing({
            limitPagination: 4,
            perPage: raws,
            containerClass: 'table__nav main-nav',
            ulClass: 'main-nav__list',
            liClass: 'main-nav__link',
            activeClass: 'main-nav__link--active',
            disabledClass: 'main-nav__link--disable'
        })

        this.$pagination = document.querySelector('.main-nav');
    }

    load(url, urlEnd) {
        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';

        xhr.onload = () => {
            let responseObj = xhr.response;
            wrapper.append(this.renderTable(responseObj.data));
            this.renderPagination(this.defaultRaws);
            wrapper.prepend(this.renderSelect(this.minRaws, this.maxRaws, this.defaultRaws));
            this.changeLimit();
            this.sortByNumber();
        };

        xhr.open('GET', url + urlEnd);
        xhr.send();
    }
}

const Table = new DataTable(
    'wrapper', 
    'https://api.odesseo.com.ua/warehouses', 
    '?limit=100&order_by=number&order=asc', 
    '?limit=100&order_by=number&order=desc', 
    2, 
    10, 
    5
);