const crypto = require('crypto');

class EFTService {
  constructor() {
    this.bankDetails = {
      fnb: {
        accountName: 'Apex Digital (Pty) Ltd',
        accountNumber: '62834567890',
        branchCode: '250655',
        referencePrefix: 'APX'
      }
    };
  }

  generateReference(projectId, userId) {
    const unique = `${projectId}-${userId}-${Date.now()}`;
    const hash = crypto.createHash('sha256').update(unique).digest('hex').substring(0, 8);
    return `${this.bankDetails.fnb.referencePrefix}${hash}`.toUpperCase();
  }

  getBankDetails(reference) {
    return {
      bank: 'FNB',
      accountName: this.bankDetails.fnb.accountName,
      accountNumber: this.bankDetails.fnb.accountNumber,
      branchCode: this.bankDetails.fnb.branchCode,
      reference: reference,
      amount: null, // to be filled by client
      instructions: 'Use the exact reference. Upload proof of payment after transfer.'
    };
  }

  verifyProof(proofFile, reference) {
    // In production, integrate with OCR service to verify amount and reference
    // For now, return true if file exists
    return proofFile ? true : false;
  }
}

module.exports = new EFTService();
