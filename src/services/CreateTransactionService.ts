// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

import CreateCategoryService from './CreateCategoryService';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: TypeTransaction | string;
  category: string;
}

enum TypeTransaction {
  income = 'income',
  outcome = 'outcome',
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('TypeTransaction must be only "income" or "outcome"');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      if (balance.total < value) {
        throw new AppError('Transação não autorizada. Saldo insuficiente');
      }
    }

    let categoryData: Category | undefined;
    if (category) {
      const categoryRepository = getCustomRepository(CategoriesRepository);
      categoryData = await categoryRepository.findOne({
        where: { title: category },
      });

      if (!categoryData) {
        const categoryService = new CreateCategoryService();

        categoryData = await categoryService.execute({ title: category });
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryData,
    });

    const transactionData = await transactionsRepository.save(transaction);
    return transactionData;
  }
}

export default CreateTransactionService;
