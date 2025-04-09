const { resolveCategoryId } = require('../src/controllers/utilityController');
const Category = require('../src/models/Category');
const mongoose = require('mongoose');

jest.mock('../src/models/Category');

describe('resolveCategoryId', () => {
    const userId = new mongoose.Types.ObjectId();

    test('should return input if it is a valid ObjectId', async () => {
        const input = new mongoose.Types.ObjectId().toString();
        const result = await resolveCategoryId(input, userId);
        expect(result).toBe(input);
    });

    test('should return _id when category name exists for user', async () => {
        const mockCategory = { _id: new mongoose.Types.ObjectId() };
        Category.findOne.mockResolvedValue(mockCategory);

        const result = await resolveCategoryId('Groceries', userId);
        expect(result).toBe(mockCategory._id);
    });

    test('should throw an error when category name not found', async () => {
        Category.findOne.mockResolvedValue(null);

        await expect(resolveCategoryId('Unknown', userId))
            .rejects
            .toThrow('Invalid category: not found');
    });
});
