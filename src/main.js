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

function calculateSimpleRevenue(purchase, _product) {
    // purchase — это одна из записей в поле items из чека в data.purchase_records
    // _product — это продукт из коллекции data.products

   const { discount, sale_price, quantity } = purchase;
   const discountPercent = 1 - discount / 100; // остаток суммы без скидки

   return sale_price * quantity * discountPercent;
}

function calculateBonusByProfit(index, total, seller) {
    // Расчет бонуса от позиции в рейтинге

    const { profit } = seller; // данные о продавце передаем объектом, const profit = seller.profit;

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

    const { calculateRevenue, calculateBonus } = options; // calculateRevenue = options.calculateRevenue
    
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

    // Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = Object.fromEntries(sellerStats.map(seller => [seller.id, seller]));
    const productIndex = Object.fromEntries(data.products.map(product => [product.sku, product]));
    // Расчет выручки и прибыли для каждого продавца

    data.purchase_records.forEach(receipt => {

        const seller = sellerIndex[receipt.seller_id];

        receipt.items.forEach(purchase => {

            const product = productIndex[purchase.sku];

            const revenue = calculateRevenue(purchase, product);

            seller.revenue += revenue;

            seller.sales_count += purchase.quantity;

            const cost = product.purchase_price * purchase.quantity;

            seller.profit += revenue - cost;

            if (!seller.products_sold[purchase.sku]) {

                seller.products_sold[purchase.sku] = 0;

            }

            seller.products_sold[purchase.sku] += purchase.quantity;

        });

    });

    // Сортировка продавцов по прибыли

    const sortedSellers = sellerStats.sort((a, b) => b.profit - a.profit);

    // Назначение премий

    sortedSellers.forEach((seller, index) => {

        seller.bonus = calculateBonus(index, sortedSellers.length, seller);

    });

    // Подготовка итоговой коллекции

    return sortedSellers.map(seller => {

        const top_products = Object.entries(seller.products_sold)

            .sort((a, b) => b[1] - a[1])

            .slice(0, 10)

            .map(([sku]) => sku);

        return {

            seller_id: seller.seller_id,

            name: seller.name,

            revenue: seller.revenue,

            profit: seller.profit,

            sales_count: seller.sales_count,

            bonus: seller.bonus,

            top_products: top_products,

        };

    });

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
