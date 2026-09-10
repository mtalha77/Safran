/** Compatibility shim. The implementation lives in the backend layer. */
export { OrderError } from "@/backend/errors";
export { parseOrderRequest } from "@/backend/validation/order";
export {
  createCashOrder,
  getOrderByToken,
} from "@/backend/services/order.service";
export type {
  CreatedOrder,
  Fulfillment,
  OrderRequest,
  PaymentMethod,
} from "@/backend/types";
