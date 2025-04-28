import { Test, TestingModule } from '@nestjs/testing';
import { TransactionPaymentService } from './transaction-payment.service';

describe('TransactionPaymentService', () => {
  let service: TransactionPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionPaymentService],
    }).compile();

    service = module.get<TransactionPaymentService>(TransactionPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
