/** Compatibility shim. The implementation lives in the backend layer. */
export {
  getHomepageCategories,
  getMenuCategories,
  getStorefrontChrome,
  getStorefrontData,
  type HomepageCategory,
  type StorefrontChrome,
  type StorefrontData,
  type StorefrontSettings,
} from "@/backend/services/storefront.service";
