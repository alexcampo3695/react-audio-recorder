import axios from 'axios';

interface ReceiptData {
  'receipt-data': string;
  'password': string;
}

interface ValidationResponse {
  status: number;
  environment: string;
  receipt: {
    receipt_type: string;
    adam_id: number;
    app_item_id: number;
    bundle_id: string;
    application_version: string;
    download_id: number;
    version_external_identifier: number;
    receipt_creation_date: string;
    receipt_creation_date_ms: string;
    receipt_creation_date_pst: string;
    request_date: string;
    request_date_ms: string;
    request_date_pst: string;
    original_purchase_date: string;
    original_purchase_date_ms: string;
    original_purchase_date_pst: string;
    original_application_version: string;
    in_app: Array<{
      quantity: string;
      product_id: string;
      transaction_id: string;
      original_transaction_id: string;
      purchase_date: string;
      purchase_date_ms: string;
      purchase_date_pst: string;
      original_purchase_date: string;
      original_purchase_date_ms: string;
      original_purchase_date_pst: string;
      expires_date: string;
      expires_date_ms: string;
      expires_date_pst: string;
      web_order_line_item_id: string;
      is_trial_period: string;
      is_in_intro_offer_period: string;
      in_app_ownership_type: string;
    }>;
  };
  latest_receipt_info?: Array<{
    quantity: string;
    product_id: string;
    transaction_id: string;
    original_transaction_id: string;
    purchase_date: string;
    purchase_date_ms: string;
    purchase_date_pst: string;
    original_purchase_date: string;
    original_purchase_date_ms: string;
    original_purchase_date_pst: string;
    expires_date: string;
    expires_date_ms: string;
    expires_date_pst: string;
    web_order_line_item_id: string;
    is_trial_period: string;
    is_in_intro_offer_period: string;
    in_app_ownership_type: string;
  }>;
  latest_receipt?: string;
  pending_renewal_info?: Array<{
    auto_renew_product_id: string;
    original_transaction_id: string;
    product_id: string;
    auto_renew_status: string;
    is_in_billing_retry_period: string;
    expiration_intent: string;
    grace_period_expires_date: string;
    grace_period_expires_date_ms: string;
    grace_period_expires_date_pst: string;
  }>;
}

const validateReceipt = async (receiptData: ReceiptData): Promise<ValidationResponse> => {
  const endpoints = {
    production: 'https://buy.itunes.apple.com/verifyReceipt',
    sandbox: 'https://sandbox.itunes.apple.com/verifyReceipt',
  };

  try {
    // First, validate against the production environment
    const productionResponse = await axios.post(endpoints.production, receiptData);

    if (productionResponse.data.status === 0) {
      // Receipt is valid in production
      return productionResponse.data;
    } else if (productionResponse.data.status === 21007) {
      // Sandbox receipt used in production, validate against sandbox
      const sandboxResponse = await axios.post(endpoints.sandbox, receiptData);

      if (sandboxResponse.data.status === 0) {
        // Receipt is valid in sandbox
        return sandboxResponse.data;
      } else {
        throw new Error('Invalid receipt in sandbox');
      }
    } else {
      throw new Error('Invalid receipt in production');
    }
  } catch (error) {
    throw new Error(`Receipt validation failed: ${error}`);
  }
};

export { validateReceipt, ReceiptData, ValidationResponse };
