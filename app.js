class Excel {

    constructor() {
        this.data = {};
        this.init();
    }

    init() {
        this.createTable();
        this.addEventsForInputs();
        this.showData();
    }

    createTable() {
        const tableContainer = document.querySelector('.app__table');
        
        for (let i = 0; i < 8; i++) {
            let row = tableContainer.insertRow();
            row.classList.add('app__row');
            
            for (let j = 0; j < 8; j++) {
                let colTitle = j > 0 ? String.fromCharCode(65 + j - 1) : null;
                let cell = row.insertCell();

                cell.classList.add('app__cell');

                cell.innerHTML = i && j ? `<input type="text" class="app__input" id=${colTitle}${i} />` : i || colTitle;
            }
        }
    }

    addEventsForInputs() {
        const inputs = document.querySelectorAll('.app__input');

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('focus', this.inputFocusHandler.bind(this));
            inputs[i].addEventListener('blur', this.inputBlurHandler.bind(this));
        }
    }

    inputFocusHandler(e) {
        e.target.value = localStorage.getItem(e.target.getAttribute('id')) || '';

        if (e.target.value.charAt(0) === "=") {
            //console.log('3')
        }
    }

    inputBlurHandler(e) {
        let currentId = e.target.getAttribute('id');

        localStorage.setItem(currentId, e.target.value);

        this.data[currentId] = e.target.value;

        if (localStorage.getItem(currentId)) {
            if (e.target.value.charAt(0) === "=") {
                let expression = e.target.value.slice(1);
                
                if (isNaN(parseInt(expression))) {
                    e.target.value = localStorage.getItem(currentId);
                    
                    let pattern = /\W/g;
                    let operators = expression.match(pattern);
                    let operands = expression.split(pattern);
                    
                    let operandsNodes = operands.map(item => {
                        if (document.getElementById(item)) {
                            let input = document.getElementById(item);
                            if (input) return input;
                        } else {
                            return item;
                        }
                    });
                    
                    let res = operandsNodes.every(item => item !== undefined);
                    
                    if (res) {
                        e.target.value = this.getCellsExpression(expression);
                    }
                } else {
                    e.target.value = eval(expression);
                }
            }
        }
    }

    showData() {
        const inputs = document.querySelectorAll('.app__input');

        for (let i = 0; i < inputs.length; i++) {
            let id = inputs[i].getAttribute('id');

            if (localStorage.getItem(id)) {
                inputs[i].value = localStorage.getItem(id);

                if (inputs[i].value.charAt(0) === "=") {
                    let expression = localStorage.getItem(id).substring(1);
                    
                    if (isNaN(parseInt(expression))) {
                        inputs[i].value = localStorage.getItem(id);

                        let pattern = /\W/g;
                        let operators = expression.match(pattern);
                        let operands = expression.split(pattern);
                        
                        let operandsNodes = operands.map(item => {
                            if (document.getElementById(item)) {
                                let input = document.getElementById(item);
                                if (input) return input;
                            } else {
                                return item;
                            }
                        });

                        let res = operandsNodes.every(item => item !== undefined);

                        if (res) inputs[i].value = this.getCellsExpression(expression);

                    } else {
                        inputs[i].value = eval(expression);
                    }
                }
            }
        }
    }

    // реализация произвольных приложений
    getCellsExpression (expression) {
        let pattern = /\W/g;
        let operators = expression.match(pattern);
        let operands = expression.split(pattern);

        if (operators === null) {
            return document.getElementById(operands[0]).value;
        }

        let operandsValues = operands.map(item => {
            if (document.getElementById(item)) {
                let inputValue = document.getElementById(item).value;
                if (inputValue) return inputValue;
            } else {
                return item;
            }  
        }).filter(item => item !== undefined);

        let cellsExpression = '';

        for (let i = 0; i < operandsValues.length; i++) {
            if (operators[i] === undefined)  {
                cellsExpression += operandsValues[i];
            } else {
                cellsExpression += operandsValues[i] + operators[i];
            }
        }

        if (isNaN(cellsExpression.charAt(cellsExpression.length - 1))) {
            cellsExpression = cellsExpression.slice(0, -1);
        }

        return eval(cellsExpression);
    }
}

const excel = new Excel();