export interface WebpayTransactionResponse {
  vci: string;
  amount: number;
  status: string;
  buy_order: string;
  session_id: string;
  card_detail: {
    card_number: string;
  };
  accounting_date: string;
  transaction_date: string; // o Date si lo conviertes con new Date()
  authorization_code: string;
  payment_type_code: string;
  response_code: number;
  installments_number: number;
}
