class AllItemsData {
    constructor() {
        this.sheetId = '2PACX-1vTmJz6UQ_RgYX73lsV5W4Yae4qQuMfsn_CM1NNmC2JtRQpTJObu5BS0e-H668Q0Zb0o5q46mPzGGqsI';
        this.loadingTimeout = null;
        this.currentFilterValue = '1';
        this.checkedItems = new Set();
        this.allData = null;
        this.maxVersion = 26;
        this.versionNames = {
            '1': 'Infdev-20100618',
            '2': 'Alpha-1.1.2_01',
            '3': 'Beta-1.7.3',
            '4': '1.0',
            '5': '1.1',
            '6': '1.2.5',
            '7': '1.3.2',
            '8': '1.4.7',
            '9': '1.5.2',
            '10': '1.6.4',
            '11': '1.7.10',
            '12': '1.8.9',
            '13': '1.9.4',
            '14': '1.10.2',
            '15': '1.11.2',
            '16': '1.12.2',
            '17': '1.13.2',
            '18': '1.14.4',
            '19': '1.15.2',
            '20': '1.16.5',
            '21': '1.17.1',
            '22': '1.18.2',
            '23': '1.19.4',
            '24': '1.20.6',
            '25': '1.21.10',
            '26': '1.22'
        };
        this.init();
    }

    async init() {
        this.showLoading();
        this.createVersionSelector();

        this.loadingTimeout = setTimeout(() => {
            const errorElement = document.getElementById('error-message');
            if (errorElement.style.display === 'none') {
                this.showError('Loading is taking longer than expected. Please wait...');
            }
        }, 10000);

        try {
            await this.loadSheetData();
            clearTimeout(this.loadingTimeout);
            this.loadSavedData();
        } catch (error) {
            console.error('Failed to load sheet data:', error);
            clearTimeout(this.loadingTimeout);
            this.showError();
        }
    }

    createVersionSelector() {
        const progressContainer = document.querySelector('.checklist-progress');

        const versionSelector = document.createElement('div');
        versionSelector.className = 'version-selector';

        let options = '';
        for (let i = 1; i <= this.maxVersion; i++) {
            const versionName = this.versionNames[i] || `Version ${i}`;
            options += `<option value="${i}">${versionName}</option>`;
        }

        versionSelector.innerHTML = `
            <label for="version-select">Current Version: </label>
            <select id="version-select">
                ${options}
            </select>
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'save-load-buttons';
        buttonContainer.innerHTML = `
            <button id="save-data" class="action-button">Save Progress</button>
            <button id="load-data" class="action-button">Load Progress</button>
            <input type="file" id="file-input" accept=".json" style="display: none;">
        `;

        progressContainer.appendChild(versionSelector);
        progressContainer.appendChild(buttonContainer);

        document.getElementById('version-select').addEventListener('change', (e) => {
            this.changeVersion(e.target.value);
        });

        document.getElementById('save-data').addEventListener('click', () => {
            this.saveData();
        });

        document.getElementById('load-data').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        document.getElementById('file-input').addEventListener('change', (e) => {
            this.loadDataFromFile(e.target.files[0]);
        });
    }

    getVersionName(versionNumber) {
        return this.versionNames[versionNumber] || `Version ${versionNumber}`;
    }

    changeVersion(newVersion) {
        this.currentFilterValue = newVersion;
        this.displayData();
    }

    saveData() {
        const saveData = {
            checkedItems: Array.from(this.checkedItems),
            currentVersion: this.currentFilterValue,
            timestamp: new Date().toISOString(),
            versionNames: this.versionNames
        };

        const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `checklist-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showTempMessage('Progress saved successfully!', 'success');
    }

    loadDataFromFile(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const saveData = JSON.parse(e.target.result);
                this.applySavedData(saveData);
                this.showTempMessage('Progress loaded successfully!', 'success');
            } catch (error) {
                console.error('Error loading save file:', error);
                this.showTempMessage('Error loading save file. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    loadSavedData() {
        const savedData = localStorage.getItem('checklistProgress');
        if (savedData) {
            try {
                const saveData = JSON.parse(savedData);
                this.applySavedData(saveData);
                console.log('Loaded progress from localStorage');
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        }
    }

    applySavedData(saveData) {
        if (saveData.checkedItems) {
            this.checkedItems = new Set(saveData.checkedItems);
        }

        if (saveData.currentVersion) {
            this.currentFilterValue = saveData.currentVersion;
            document.getElementById('version-select').value = this.currentFilterValue;
        }

        if (saveData.versionNames) {
            this.versionNames = { ...this.versionNames, ...saveData.versionNames };
            this.updateVersionSelector();
        }

        this.displayData();
    }

    updateVersionSelector() {
        const versionSelect = document.getElementById('version-select');
        if (versionSelect) {
            versionSelect.innerHTML = '';
            for (let i = 1; i <= this.maxVersion; i++) {
                const versionName = this.versionNames[i] || `Version ${i}`;
                const option = document.createElement('option');
                option.value = i;
                option.textContent = versionName;
                versionSelect.appendChild(option);
            }
            versionSelect.value = this.currentFilterValue;
        }
    }

    autoSave() {
        const saveData = {
            checkedItems: Array.from(this.checkedItems),
            currentVersion: this.currentFilterValue,
            timestamp: new Date().toISOString(),
            versionNames: this.versionNames
        };
        localStorage.setItem('checklistProgress', JSON.stringify(saveData));
    }

    showTempMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `temp-message ${type}`;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    showLoading() {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error-message');

        loading.style.display = 'block';
        error.style.display = 'none';
        loading.innerHTML = 'Loading data from All Items Checklist...';
    }

    async loadSheetData() {
        try {
            await this.loadCSVData();
        } catch (error1) {
            console.log('CSV method failed, trying alternative...', error1);
            try {
                await this.tryAlternativeMethod();
            } catch (error2) {
                console.log('All methods failed', error2);
                throw new Error('Could not load sheet data');
            }
        }
    }

    async loadCSVData() {
        const csvUrl = `https://docs.google.com/spreadsheets/d/e/${this.sheetId}/pub?output=csv&${Date.now()}`;

        console.log('Loading CSV from:', csvUrl);

        const response = await fetch(csvUrl);

        if (!response.ok) {
            throw new Error(`CSV HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        console.log('CSV data received, length:', csvText.length);

        if (csvText.length < 10) {
            throw new Error('CSV data too short - likely empty response');
        }

        this.parseCSVData(csvText);
    }

    async tryAlternativeMethod() {
        const altUrl = `https://docs.google.com/spreadsheets/d/e/${this.sheetId}/pub?gid=0&single=true&output=csv`;

        console.log('Trying alternative URL:', altUrl);

        const response = await fetch(altUrl);

        if (!response.ok) {
            throw new Error(`Alternative method HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        console.log('Alternative method data received, length:', csvText.length);

        this.parseCSVData(csvText);
    }

    parseCSVData(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            throw new Error('No data found in CSV');
        }

        console.log('CSV lines found:', lines.length);

        const tableData = {
            cols: [],
            rows: []
        };

        // Parse header
        const headers = this.parseCSVLine(lines[0]);
        tableData.cols = headers.map(header => ({ label: header.trim() }));

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const rowData = this.parseCSVLine(lines[i]);
            if (rowData.length > 0 && rowData.some(cell => cell.trim() !== '')) {
                tableData.rows.push({
                    c: rowData.map(cell => ({ v: cell.trim(), f: cell.trim() }))
                });
            }
        }

        console.log('Parsed data:', {
            columns: tableData.cols.length,
            rows: tableData.rows.length
        });

        this.allData = tableData;
        this.displayData();
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '"';

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
            } else if (char === quoteChar && inQuotes) {
                if (i + 1 < line.length && line[i + 1] === quoteChar) {
                    current += char;
                    i++;
                } else {
                    inQuotes = false;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    }

    displayData() {
        if (!this.allData) {
            this.showError('No data loaded');
            return;
        }

        const header = document.getElementById('table-header');
        const body = document.getElementById('table-body');
        const table = document.getElementById('data-table');
        const loading = document.getElementById('loading');

        header.innerHTML = '';
        body.innerHTML = '';

        const targetColumns = [0, 1, 3];
        const filterColumnIndex = 7;

        // Create header row
        if (this.allData.cols && this.allData.cols.length > 0) {
            const headerRow = document.createElement('tr');

            // Data columns
            targetColumns.forEach(colIndex => {
                if (this.allData.cols[colIndex]) {
                    const th = document.createElement('th');
                    th.textContent = this.allData.cols[colIndex].label || `Column ${colIndex + 1}`;
                    headerRow.appendChild(th);
                }
            });

            // Checkbox column header
            const checkHeader = document.createElement('th');
            checkHeader.textContent = 'Done';
            checkHeader.className = 'checkbox-cell';
            headerRow.appendChild(checkHeader);

            header.appendChild(headerRow);
        }

        if (this.allData.rows && this.allData.rows.length > 0) {
            let displayedRows = 0;

            // Display rows
            this.allData.rows.forEach((row, rowIndex) => {
                if (row.c && row.c[filterColumnIndex]) {
                    const filterCell = row.c[filterColumnIndex];
                    const filterValue = filterCell.f || filterCell.v;

                    if (String(filterValue).trim() === this.currentFilterValue) {
                        const tr = document.createElement('tr');
                        const rowId = `row-${rowIndex}`;
                        tr.id = rowId;

                        // Check if this row is already completed
                        const isCompleted = this.checkedItems.has(rowId);
                        if (isCompleted) {
                            tr.classList.add('row-completed');
                        }

                        // Data columns
                        targetColumns.forEach((colIndex) => {
                            const td = document.createElement('td');

                            if (row.c && row.c[colIndex]) {
                                const cell = row.c[colIndex];
                                td.textContent = this.getCellValue(cell);
                            } else {
                                td.textContent = '';
                            }

                            tr.appendChild(td);
                        });

                        // Checkbox column
                        const checkTd = document.createElement('td');
                        checkTd.className = 'checkbox-cell';
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = isCompleted;
                        checkbox.addEventListener('change', (e) => {
                            this.handleCheckboxChange(rowId, e.target.checked);
                        });
                        checkTd.appendChild(checkbox);
                        tr.appendChild(checkTd);

                        body.appendChild(tr);
                        displayedRows++;
                    }
                }
            });

            this.updateProgress();
            console.log(`Displayed ${displayedRows} rows with filter value: ${this.currentFilterValue}`);
        } else {
            console.warn('No rows to display');
        }

        loading.style.display = 'none';
        table.style.display = 'table';
    }

    handleCheckboxChange(rowId, isChecked) {
        if (isChecked) {
            this.checkedItems.add(rowId);
        } else {
            this.checkedItems.delete(rowId);
        }

        const row = document.getElementById(rowId);
        if (row) {
            if (isChecked) {
                row.classList.add('row-completed');
            } else {
                row.classList.remove('row-completed');
            }
        }

        this.updateProgress();
        this.autoSave();

        // Check if all items in CURRENT version are completed
        this.checkVersionCompletion();
    }

    checkVersionCompletion() {
        const totalRowsInCurrentVersion = this.countRowsInCurrentVersion();

        // Count only checked items that belong to CURRENT version
        let checkedInCurrentVersion = 0;
        this.checkedItems.forEach(rowId => {
            const rowIndex = parseInt(rowId.replace('row-', ''));
            if (this.allData.rows[rowIndex] && this.allData.rows[rowIndex].c) {
                const filterColumnIndex = 7;
                const filterCell = this.allData.rows[rowIndex].c[filterColumnIndex];
                if (filterCell) {
                    const filterValue = filterCell.f || filterCell.v;
                    if (String(filterValue).trim() === this.currentFilterValue) {
                        checkedInCurrentVersion++;
                    }
                }
            }
        });

        // Only trigger completion if ALL items in CURRENT version are checked
        if (checkedInCurrentVersion >= totalRowsInCurrentVersion && totalRowsInCurrentVersion > 0) {
            this.progressToNextVersion();
        }
    }

    countRowsInCurrentVersion() {
        const filterColumnIndex = 7;
        let count = 0;

        if (this.allData && this.allData.rows) {
            this.allData.rows.forEach(row => {
                if (row.c && row.c[filterColumnIndex]) {
                    const filterCell = row.c[filterColumnIndex];
                    const filterValue = filterCell.f || filterCell.v;
                    if (String(filterValue).trim() === this.currentFilterValue) {
                        count++;
                    }
                }
            });
        }

        return count;
    }

    updateProgress() {
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');

        // Count checked items for CURRENT version only
        let checkedInCurrentVersion = 0;
        const totalRowsInCurrentVersion = this.countRowsInCurrentVersion();

        // Count only checked items that belong to current version
        this.checkedItems.forEach(rowId => {
            const rowIndex = parseInt(rowId.replace('row-', ''));
            if (this.allData.rows[rowIndex] && this.allData.rows[rowIndex].c) {
                const filterColumnIndex = 7;
                const filterCell = this.allData.rows[rowIndex].c[filterColumnIndex];
                if (filterCell) {
                    const filterValue = filterCell.f || filterCell.v;
                    if (String(filterValue).trim() === this.currentFilterValue) {
                        checkedInCurrentVersion++;
                    }
                }
            }
        });

        const progress = totalRowsInCurrentVersion > 0 ?
            (checkedInCurrentVersion / totalRowsInCurrentVersion) * 100 : 0;

        const versionName = this.getVersionName(this.currentFilterValue);
        progressText.textContent = `${versionName}: ${checkedInCurrentVersion}/${totalRowsInCurrentVersion} completed`;
        progressFill.style.width = `${progress}%`;
    }

    progressToNextVersion() {
        const nextValue = String(parseInt(this.currentFilterValue) + 1);
        const currentVersionName = this.getVersionName(this.currentFilterValue);
        const nextVersionName = this.getVersionName(nextValue);

        if (parseInt(nextValue) <= this.maxVersion) {
            document.getElementById('version-select').value = nextValue;
        }

        if (confirm(`Congratulations! You've completed all items in ${currentVersionName}. Move to ${nextVersionName}?`)) {
            this.currentFilterValue = nextValue;
            this.displayData();
        }
    }

    getCellValue(cell) {
        if (cell.f) {
            return String(cell.f);
        } else if (cell.v !== null && cell.v !== undefined) {
            return String(cell.v);
        }
        return '';
    }

    showError(customMessage = 'Failed to load data from Google Sheets. Please check if the sheet is published to web and accessible.') {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error-message');

        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = customMessage;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AllItemsData();
});