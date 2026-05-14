/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */

// Расчет бонуса от позиции в рейтинге
function calculateBonusByProfit(index, total, seller) {
    const { profit } = seller; // данные о продавце передаем объектом

    if (index === 0) { 
        return profit * 0.15;
    } else if (index === 1 || index === 2) {
        return profit * 0.10;
    } else if (index === total - 1) {
        return 0;
    } else {
        return profit * 0.05;
    }
}

// Расчет выручки
function calculateSimpleRevenue(purchase, _product) {
    // purchase — это одна из записей в поле items из чека в data.purchase_records
    // _product — это продукт из коллекции data.products

   const { discount, sale_price, quantity } = purchase;
   const discountPercent = 1 - discount / 100; // остаток суммы без скидки

   return sale_price * quantity * discountPercent;
}


function analyzeSalesData(data, options) {
    // Проверка входных данных
    if (
        !data ||
        !Array.isArray(data.sellers) ||
        !Array.isArray(data.products) ||
        !Array.isArray(data.purchase_records) ||
        data.sellers.length === 0 ||
        data.products.length === 0 ||
        data.purchase_records.length === 0
    ) {
        throw new Error('Некорректные входные данные');
    }

    const { calculateRevenue, calculateBonus } = options;
    
    // Проверка наличия опций
    if (!calculateRevenue || !calculateBonus) {
        throw new Error('Не переданы функции');
    }

    // Подготовка промежуточных данных для сбора статистики
    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {},
    }));

    // Индексация продавцов для быстрого доступа
    const sellerIndex = Object.fromEntries(sellerStats.map(seller =>
        [seller.id, seller])
    );

    //  Индексация товаров для быстрого доступа
    const productIndex = Object.fromEntries(data.products.map(product =>
        [product.sku, product])
    );

    // Расчет выручки и прибыли для каждого продавца
    data.purchase_records.forEach(receipt => {
        const seller = sellerIndex[receipt.seller_id];
        seller.sales_count += 1;

        receipt.items.forEach(item => {
            const product = productIndex[item.sku];

            const revenue = Number(calculateRevenue(item, product).toFixed(2));
            const cost = product.purchase_price * item.quantity;
            const profit = revenue - cost;

            seller.revenue += revenue;
            seller.profit += profit;

            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }

seller.products_sold[item.sku] += item.quantity;
        });
    })

    // Сортировка продавцов по прибыли
    sellerStats.sort((a, b) => b.profit - a.profit);    

    // Назначение премий на основе ранжирования 
    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(
            index,
            sellerStats.length,
            seller
        );
    });

    // Подготовка итоговой коллекции с нужными полями
    return sellerStats.map(seller => ({
        seller_id: seller.id,
        name: seller.name,
        revenue: +(seller.revenue.toFixed(2)),
        profit: +(seller.profit.toFixed(2)),
        sales_count: seller.sales_count,
        top_products: Object.entries(seller.products_sold)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([sku, quantity]) => ({
                sku,
                quantity})),
        bonus: +(seller.bonus.toFixed(2)),
    }));
}
