import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * /api/v1/contact:
 *   post:
 *     summary: Submit a contact / support inquiry
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Kumar
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *               phone:
 *                 type: string
 *                 example: "+91 9876543210"
 *               inquiryType:
 *                 type: string
 *                 enum: [PUBLISHER_SUPPORT, PAYOUT_QUERY, REPORT_ABUSE, GENERAL]
 *                 default: GENERAL
 *               subject:
 *                 type: string
 *                 example: Inquiry about UPI Payout
 *               message:
 *                 type: string
 *                 example: How long does a manual bank transfer take to process?
 *     responses:
 *       200:
 *         description: Inquiry submitted successfully
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, inquiryType, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and message.'
      });
    }

    const ticketId = `NGK-${Math.floor(100000 + Math.random() * 900000)}`;

    console.log(`[Contact Desk] New inquiry received: Ticket #${ticketId} from ${name} (${email}) - ${subject || 'General'}`);

    return res.status(200).json({
      success: true,
      ticketId,
      message: 'Your inquiry has been received. Our team will get back to you within 24 hours.',
      data: {
        ticketId,
        name,
        email,
        phone: phone || null,
        inquiryType: inquiryType || 'GENERAL',
        subject: subject || 'General Inquiry',
        createdAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('[Contact Desk] Error submitting inquiry:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit your message. Please try again later.'
    });
  }
});

export default router;
