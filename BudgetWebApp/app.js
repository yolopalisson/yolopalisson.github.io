// Budget Controller
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value; // we can also write this equation like: sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // Creating a new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Creating a new item based on income and expense
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // 'Pushing' or adding new item into the data structure
            data.allItems[type].push(newItem);

            // returning the new item
            return newItem;
        },

        deleteItems: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {
            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');


            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the perentage of the income spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                totalPercentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();



// User Interface controller module
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        totalBudgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpenses: '.budget__expenses--value',
        budgetPercentage: '.budget__expenses--percentage',
        container: '.container',
        itemPercentage: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);  // to convert a number to an absolute integer
        num = num.toFixed(2);  // to round off a number to two decimal points

        numSplit = num.split('.');  // to split the number in two (integer and decimal)

        int = numSplit[0];  // first part of the array is the integer
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];  // second part of the array is the decimal

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }

    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
            
        },
        
        addListItem: function(obj, type) {
            var html, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
 

            // Replace placeholder text with actual data
            var newHtml = html.replace('%id', obj.id);
            var newHtml = newHtml.replace('%description%', obj.description);
            var newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItems: function(selectorID) {
            var elm;

            elm = document.getElementById(selectorID);
            elm.parentNode.removeChild(elm);

        },

        // Public function which clears input fields after successfully adding income/expense
        clearFields: function () {
            var fields, fieldsArr;

            // Targets the input fields 'description' and 'value'
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, value) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.totalBudgetValue).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.budgetIncome).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.budgetExpenses).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.totalPercentage > 0) {
                document.querySelector(DOMStrings.budgetPercentage).textContent = obj.totalPercentage + '%';
            } else {
                document.querySelector(DOMStrings.budgetPercentage).textContent = '---';
            }

        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMStrings.itemPercentage);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = percentages[index] + '---';  
                }

            });

        },

        displayDate: function() {
            var now, months, month, year;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        
        getDOMStrings: function() {
            return DOMStrings;
        }
    };

})();



// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', crtlAddItem);
    
        document.addEventListener('keypress', function(event) {
            
            // if the Enter key is pressed, this action will commence
            if (event.keyCode === 13) {
                crtlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    
    // Update and display the budget
    var updateBudget = function() {
        var showBudget;
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        
        // 2. Return the budget
        showBudget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        UICtrl.displayBudget(showBudget);
    };

    
    var updatePercentages = function() {
        var percentages;

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();


        // 2. Read from budget controller
        percentages = budgetCtrl.getPercentages();


        // 3. Display on the UI
        UICtrl.displayPercentages(percentages);

    };
    
    var crtlAddItem = function() {
        var input, newItem;


        // 1. Get field input data
        input = UICtrl.getInput();

        // If all these conditions are met, point 2-5 should be executed
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // the description must not be empty + the value should not be null + the value should be greater than 0

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    
    
            // 3. Add the item to the User Interface
            UICtrl.addListItem(newItem, input.type);
    
    
            // 4. Clear the fields
            UICtrl.clearFields();
    
    
            // 5. Calculate and update the budget
            updateBudget();

            // 6. Calculate and display percentages
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // this is for the purpose of splitting the each item ID in two
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);


            // 1. Delete item from the data structure
            budgetCtrl.deleteItems(type, ID);


            // 2. Delete item from the UI
            UICtrl.deleteListItems(itemID);


            // 3. Update and and show new the totals
            updateBudget();

            // 4. Calculate and display percentages
            updatePercentages();
        }
    };

    // Initializing the event listeners
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayDate();
            
            // Display the budget on the UI
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                totalPercentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);


// Initializing the global app controller
controller.init();