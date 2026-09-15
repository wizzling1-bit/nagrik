import { PayoutService } from '../services/payout.service';
import {
  UsersDb,
  CreatorsDb,
  PayoutMethodsDb,
  memoryStore
} from '../db/supabaseClient';
import { UserRole, PayoutMethodType } from '@naagrik/shared-types';

beforeEach(() => {
  memoryStore.clear();
});

describe('Creator Monetization - Minimum $10.00 Payout Rule Test (Supabase)', () => {
  it('rejects payout requests below $10.00 and approves requests at or above $10.00', async () => {
    const creatorUser = await UsersDb.create({
      name: 'Payout Creator',
      email: 'payout@test.com',
      passwordHash: 'hash',
      role: UserRole.CREATOR
    });

    const creator = await CreatorsDb.create({
      userId: creatorUser.id,
      availableBalance: 25.00
    });

    const payoutMethod = await PayoutMethodsDb.create({
      creatorId: creator.id,
      type: PayoutMethodType.UPI,
      upiId: 'creator@upi'
    });

    const creatorIdStr = creator.id;
    const methodIdStr = payoutMethod!.id;

    // 1. Attempt $9.99 Payout -> MUST FAIL
    await expect(
      PayoutService.createPayoutRequest(creatorIdStr, 9.99, methodIdStr)
    ).rejects.toThrow(/below minimum threshold of \$10\.00/);

    // 2. Attempt $10.00 Payout -> MUST SUCCEED
    const req10 = await PayoutService.createPayoutRequest(creatorIdStr, 10.00, methodIdStr);
    expect(req10).toBeDefined();
    expect(req10!.amount).toBe(10.00);
    expect(req10!.status).toBe('PENDING');

    // 3. Attempt $20.00 Payout when available balance is reduced to $15.00 -> MUST FAIL due to insufficient balance
    await expect(
      PayoutService.createPayoutRequest(creatorIdStr, 20.00, methodIdStr)
    ).rejects.toThrow(/Insufficient available balance/);

    // 4. Attempt $15.00 Payout -> MUST SUCCEED
    const req15 = await PayoutService.createPayoutRequest(creatorIdStr, 15.00, methodIdStr);
    expect(req15).toBeDefined();
    expect(req15!.amount).toBe(15.00);
  });
});
