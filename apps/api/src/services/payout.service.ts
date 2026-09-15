import {
  PayoutRequestsDb,
  PayoutMethodsDb,
  CreatorsDb,
  SystemSettingsDb,
  AuditLogsDb
} from '../db/supabaseClient';
import { PayoutStatus, UserRole, BUSINESS_RULES } from '@naagrik/shared-types';

export class PayoutService {
  /**
   * Request creator payout. Strictly enforced balance >= $10.00.
   */
  static async createPayoutRequest(creatorId: string, amount: number, payoutMethodId: string) {
    const setting = await SystemSettingsDb.get();
    const minPayout = setting?.minPayoutAmount || BUSINESS_RULES.MIN_PAYOUT_AMOUNT;

    if (amount < minPayout) {
      throw new Error(`Requested payout amount $${amount.toFixed(2)} is below minimum threshold of $${minPayout.toFixed(2)}.`);
    }

    const creator = await CreatorsDb.findById(creatorId);
    if (!creator) {
      throw new Error('Creator profile not found.');
    }

    const availableBalance = creator.availableBalance ?? creator.available_balance ?? 0;
    if (availableBalance < amount) {
      throw new Error(`Insufficient available balance ($${availableBalance.toFixed(2)}). Cannot request $${amount.toFixed(2)}.`);
    }

    const payoutMethod = await PayoutMethodsDb.findById(payoutMethodId);
    const methodCreatorId = payoutMethod?.creatorId || payoutMethod?.creator_id;
    if (!payoutMethod || methodCreatorId !== creatorId) {
      throw new Error('Invalid or unverified payout method.');
    }

    // Deduct available balance and hold in pending amount
    const newBalance = Number((availableBalance - amount).toFixed(2));
    await CreatorsDb.update(creator.id, {
      availableBalance: newBalance,
      available_balance: newBalance
    });

    const payoutRequest = await PayoutRequestsDb.create({
      creatorId,
      amount,
      payoutMethodId,
      status: PayoutStatus.PENDING,
      requestedAt: new Date()
    });

    return payoutRequest;
  }

  /**
   * Admin processes payout request (PAID, REJECTED, etc.)
   */
  static async processPayoutRequest(
    adminId: string,
    adminEmail: string,
    requestId: string,
    status: PayoutStatus,
    transactionReference?: string,
    adminNote?: string
  ) {
    const payoutRequest = await PayoutRequestsDb.findById(requestId);
    if (!payoutRequest) {
      throw new Error('Payout request not found.');
    }

    if (payoutRequest.status === PayoutStatus.PAID) {
      throw new Error('Payout request has already been paid and processed.');
    }

    const reqCreatorId = payoutRequest.creatorId?.id || payoutRequest.creatorId || payoutRequest.creator_id;
    const creator = await CreatorsDb.findById(reqCreatorId);

    if (status === PayoutStatus.PAID) {
      if (!transactionReference) {
        throw new Error('Transaction reference / UTR is required when marking payout as PAID.');
      }
      
      const totalPaid = creator?.totalPaid ?? creator?.total_paid ?? 0;
      const newTotalPaid = Number((totalPaid + payoutRequest.amount).toFixed(2));

      await PayoutRequestsDb.update(requestId, {
        status: PayoutStatus.PAID,
        transactionReference,
        transaction_reference: transactionReference,
        processedAt: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        adminNote: adminNote || null,
        admin_note: adminNote || null
      });

      if (creator) {
        await CreatorsDb.update(creator.id, {
          totalPaid: newTotalPaid,
          total_paid: newTotalPaid
        });
      }
    } else if (status === PayoutStatus.REJECTED) {
      await PayoutRequestsDb.update(requestId, {
        status: PayoutStatus.REJECTED,
        adminNote: adminNote || 'Payout request rejected by admin.',
        admin_note: adminNote || 'Payout request rejected by admin.'
      });

      // Return held funds back to available balance
      if (creator) {
        const availableBalance = creator.availableBalance ?? creator.available_balance ?? 0;
        const refundedBalance = Number((availableBalance + payoutRequest.amount).toFixed(2));
        await CreatorsDb.update(creator.id, {
          availableBalance: refundedBalance,
          available_balance: refundedBalance
        });
      }
    }

    // Audit Log
    await AuditLogsDb.create({
      actorId: adminId,
      actorEmail: adminEmail,
      actorRole: UserRole.ADMIN,
      action: `PAYOUT_REQUEST_${status}`,
      entity: 'PayoutRequest',
      entityId: requestId,
      metadata: { amount: payoutRequest.amount, status, transactionReference }
    });

    return await PayoutRequestsDb.findById(requestId);
  }
}
