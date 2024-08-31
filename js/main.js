$(document).ready(function() {
    let balance = 0;

    $('#transaction-form').submit(function(event) {
        event.preventDefault();

        let type = $('#transaction-type').val();
        let amount = parseFloat($('#transaction-amount').val());
        let errorMessage = '';

        if (isNaN(amount) || amount <= 0) {
            errorMessage = 'Please enter a valid amount greater than 0.';
            $('#error-message').text(errorMessage);
            return;
        }

        $('#error-message').text(''); 

        if (type === 'expense') {
            amount = -amount;
        }

        balance += amount;
        $('#balance-amount').text(balance.toFixed(2));

        let transactionHtml = `
            <li class="d-flex justify-content-between align-items-center show">
                <span><strong>${type === 'income' ? 'Income' : 'Expense'}</strong>: ${amount.toFixed(2)}</span>
                <button class="btn btn-danger btn-sm delete-button"><i class="fas fa-trash"></i></button>
            </li>
        `;

        $('#transaction-list').append(transactionHtml);
        $('#transaction-form')[0].reset();
        saveTransactions();
    });

    $('#transaction-list').on('click', '.delete-button', function() {
        let $item = $(this).closest('li');
        let amount = parseFloat($item.find('span').text().match(/[-\d.]+/)[0]);
        balance -= amount;
        $('#balance-amount').text(balance.toFixed(2));
        
        $item.addClass('fade-out').delay(300).queue(function(next) {
            $(this).remove();
            saveTransactions();
            next();
        });
    });

    function saveTransactions() {
        let transactions = [];
        $('#transaction-list li').each(function() {
            let transaction = {
                text: $(this).clone().children().remove().end().text().trim(),
                amount: $(this).find('span').text().match(/[-\d.]+/)[0]
            };
            transactions.push(transaction);
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function loadTransactions() {
        let transactions = JSON.parse(localStorage.getItem('transactions'));
        if (transactions) {
            transactions.forEach(function(transaction) {
                let amount = parseFloat(transaction.amount);
                balance += amount;

                $('#balance-amount').text(balance.toFixed(2));

                let transactionHtml = `
                    <li class="d-flex justify-content-between align-items-center show">
                        <span><strong>${amount >= 0 ? 'Income' : 'Expense'}</strong>: ${Math.abs(amount).toFixed(2)}</span>
                        <button class="btn btn-danger btn-sm delete-button"><i class="fas fa-trash"></i></button>
                    </li>
                `;

                $('#transaction-list').append(transactionHtml);
            });
        }
    }

    loadTransactions();
});
