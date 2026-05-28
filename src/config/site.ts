/**
 * CUSTOM BUILD FEATURE FLAGS
 *
 * File ini adalah pusat komando (Boilerplate Config) untuk sistem Single-Tenant Custom Build.
 * Tim IT cukup merubah nilai `false` menjadi `true` pada bagian `features` sesuai
 * dengan add-on yang dibeli oleh klien pada halaman Kalkulator (Rakit Website).
 *
 * PENTING:
 * Komponen UI di dalam project ini (seperti Navbar, Footer, Pages) harus membaca
 * nilai dari file ini sebelum melakukan render. Jika `hasBlog` false, maka link ke
 * halaman /blog tidak boleh dimunculkan, dan halaman /blog harus mengembalikan 404.
 */

export const CLIENT_CONFIG = {
  // Informasi Dasar Klien
  clientName: "Japan Arena Custom Build",
  template: "ecommerce-basic", // e.g., 'corporate', 'ecommerce-basic', 'lms-lite'

  // Pengaturan Branding (Visual)
  branding: {
    colors: {
      primary: "#0071E3", // Ganti sesuai brand klien
      secondary: "#1A1A24",
    },
    logoUrl: "/assets/logo-placeholder.png", // Path ke logo klien
  },

  // Feature Flags (Saklar Add-on)
  // AKTIFKAN (true) HANYA JIKA KLIEN MEMBELI ADD-ON TERSEBUT.
  features: {
    // General Add-ons
    hasAdminDashboard: false,
    hasWaAutomation: false,
    hasGoogleSheetsSync: false,
    hasInvoiceAutomation: false,
    hasSeoTechnicalSetup: true, // Contoh default nyala
    hasLiveChat: false,
    hasMembershipSystem: false,
    hasApiIntegration: false,
    hasEmailAutomation: false,
    hasCrmCustomer: false,

    // E-Commerce Add-ons
    hasCartAndCheckout: false,
    hasPackageTracking: false,
    hasProductWishlist: false,
    hasProductReview: false,
    hasVoucherPromo: false,
    hasAffiliateSystem: false,
    hasStockManagement: false,

    // Blog / Media
    hasBlogSystem: false,

    // Booking / Reservasi
    hasOnlineBooking: false,
  },

  // Pengaturan Integrasi API Keys (Gunakan environment variables di .env.local)
  integrations: {
    midtransEnabled: false, // Jika true, pastikan MIDTRANS_SERVER_KEY terisi di .env
    googleMapsEnabled: false,
  }
};
