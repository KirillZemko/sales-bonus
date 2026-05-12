/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
}

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

   const { discount, sale_price, quantity } = purchase; // деструктуризация объекта, далее идентичная запись const discount = purchase.discount...
   const discountPercent = 1 - discount / 100;

   return sale_price * quantity * discountPercent;
}

function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге

    const { profit } = seller; // идентичная запись: const profit = seller.profit; { деструктуризация объекта }

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

const { calculateRevenue, calculateBonus } = options; // Сюда передадим функции для расчётов

if (!calculateRevenue || !calculateBonus) {
    throw new Error('Не переданы функции');
}

// @TODO: Проверка входных данных

// @TODO: Проверка наличия опций

// @TODO: Подготовка промежуточных данных для сбора статистики

// @TODO: Индексация продавцов и товаров для быстрого доступа

// @TODO: Расчет выручки и прибыли для каждого продавца

// @TODO: Сортировка продавцов по прибыли

// @TODO: Назначение премий на основе ранжирования

// @TODO: Подготовка итоговой коллекции с нужными полями
}
