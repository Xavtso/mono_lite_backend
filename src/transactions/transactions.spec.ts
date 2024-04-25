import { NotFoundException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionUtils } from './transactionUtils.service';
import { CardsService } from '../cards/cards.service';
import { createTransactionDto } from './dto/create-transaction.dto'; // Імпорт типу createTransactionDto

describe('TransactionUtils', () => {
  let transactionUtils: TransactionUtils;
  let mockCardService: Partial<CardsService>;

  beforeEach(async () => {
    mockCardService = {
      getCardByNumber: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionUtils,
        { provide: CardsService, useValue: mockCardService },
      ],
    }).compile();

    transactionUtils = module.get<TransactionUtils>(TransactionUtils);
  });

  describe('getReceiverCard', () => {
    it('should throw NotFoundException if receiver card is not found', async () => {
      // Arrange
      const dto: createTransactionDto = {
        // Використовуємо тип createTransactionDto
        user_id: 123,
        transaction_amount: 100,
        transaction_description: 'Test transaction',
        receiver_card_number: '1234567890123456',
        operation: '',
      };
      (mockCardService.getCardByNumber as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(transactionUtils.getReceiverCard(dto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw ConflictException if receiver card is blocked', async () => {
      // Arrange
      const dto: createTransactionDto = {
        // Використовуємо тип createTransactionDto
        user_id: 123,
        transaction_amount: 100,
        transaction_description: 'Test transaction',
        receiver_card_number: '1234567890123456',
        operation: 'deposit',
      };
      const blockedCard = { blocked: true };
      (mockCardService.getCardByNumber as jest.Mock).mockResolvedValue(
        blockedCard,
      );

      // Act & Assert
      await expect(transactionUtils.getReceiverCard(dto)).rejects.toThrowError(
        ConflictException,
      );
    });

    it('should return receiver card if it exists and is not blocked', async () => {
      // Arrange
      const dto: createTransactionDto = {
        // Використовуємо тип createTransactionDto
        user_id: 123,
        transaction_amount: 100,
        transaction_description: 'Test transaction',
        receiver_card_number: '1234567890123456',
        operation: 'deposit',
      };
      const receiverCard = { blocked: false };
      (mockCardService.getCardByNumber as jest.Mock).mockResolvedValue(
        receiverCard,
      );

      // Act
      const result = await transactionUtils.getReceiverCard(dto);

      // Assert
      expect(result).toEqual(receiverCard);
    });
  });
});
