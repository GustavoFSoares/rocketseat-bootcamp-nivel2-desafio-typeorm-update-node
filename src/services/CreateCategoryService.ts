// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import AppError from '../errors/AppError';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getCustomRepository(CategoriesRepository);

    const categoryExists = await categoryRepository.findOne({
      where: { title },
    });
    if (categoryExists) {
      throw new AppError('category-already-exist');
    }

    const category = categoryRepository.create({ title });
    const categoryData = await categoryRepository.save(category);

    return categoryData;
  }
}

export default CreateCategoryService;
