// ============================================================
// OnTarget Payment OS — TypeScript Database Types
// Auto-mapped from Supabase PostgreSQL schema v1.0.0
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================
// ENUMS
// ============================================================

export type UserRole = 'admin' | 'merchant' | 'operator'
export type MerchantStatus = 'active' | 'paused' | 'suspended'
export type PaymentMethodType = 'wallet' | 'bank' | 'cash' | 'crypto' | 'card'
export type AccountStatus = 'active' | 'paused' | 'full'
export type TransactionType = 'deposit' | 'payout'
export type TransactionStatus =
  | 'created'
  | 'pending'
  | 'proof_uploaded'
  | 'under_review'
  | 'auto_matched'
  | 'approved'
  | 'declined'
  | 'expired'
  | 'cancelled'
export type RawEventSource = 'sms' | 'email' | 'binance' | 'manual' | 'n8n'
export type RawEventStatus = 'received' | 'parsed' | 'matched' | 'failed' | 'duplicate'
export type FeeType = 'percentage' | 'fixed'
export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type CallbackStatus = 'pending' | 'sent' | 'failed' | 'retrying'
export type KeyStatus = 'active' | 'revoked'
export type MethodStatus = 'active' | 'inactive'
export type AllocationStatus = 'reserved' | 'confirmed' | 'released'

// ============================================================
// ROW TYPES
// ============================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string | null
          role: UserRole
          merchant_id: string | null
          language: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email?: string | null
          role?: UserRole
          merchant_id?: string | null
          language?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          role?: UserRole
          merchant_id?: string | null
          language?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }

      merchants: {
        Row: {
          id: string
          name: string
          code: string
          business_name: string | null
          contact_email: string | null
          contact_phone: string | null
          status: MerchantStatus
          default_currency: string
          callback_url: string | null
          success_url: string | null
          fail_url: string | null
          webhook_secret: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          business_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          status?: MerchantStatus
          default_currency?: string
          callback_url?: string | null
          success_url?: string | null
          fail_url?: string | null
          webhook_secret?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          code?: string
          business_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          status?: MerchantStatus
          default_currency?: string
          callback_url?: string | null
          success_url?: string | null
          fail_url?: string | null
          webhook_secret?: string | null
          updated_at?: string
        }
      }

      merchant_api_keys: {
        Row: {
          id: string
          merchant_id: string
          key_prefix: string
          key_hash: string
          label: string | null
          status: KeyStatus
          last_used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          key_prefix: string
          key_hash: string
          label?: string | null
          status?: KeyStatus
          last_used_at?: string | null
          created_at?: string
        }
        Update: {
          status?: KeyStatus
          label?: string | null
          last_used_at?: string | null
        }
      }

      payment_methods: {
        Row: {
          id: string
          name: string
          name_ar: string | null
          code: string
          country: string
          currency: string
          type: PaymentMethodType
          status: MethodStatus
          min_amount: number
          max_amount: number
          icon_url: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar?: string | null
          code: string
          country?: string
          currency?: string
          type?: PaymentMethodType
          status?: MethodStatus
          min_amount?: number
          max_amount?: number
          icon_url?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          name?: string
          name_ar?: string | null
          status?: MethodStatus
          min_amount?: number
          max_amount?: number
          icon_url?: string | null
          sort_order?: number
        }
      }

      payment_accounts: {
        Row: {
          id: string
          method_id: string
          provider: string
          account_number: string
          account_name: string
          label: string | null
          country: string
          currency: string
          daily_limit: number
          used_today: number
          min_amount: number
          max_amount: number
          priority: number
          status: AccountStatus
          assigned_merchant_ids: string[]
          notes: string | null
          reset_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          method_id: string
          provider: string
          account_number: string
          account_name: string
          label?: string | null
          country?: string
          currency?: string
          daily_limit?: number
          used_today?: number
          min_amount?: number
          max_amount?: number
          priority?: number
          status?: AccountStatus
          assigned_merchant_ids?: string[]
          notes?: string | null
          reset_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          provider?: string
          account_number?: string
          account_name?: string
          label?: string | null
          country?: string
          currency?: string
          daily_limit?: number
          used_today?: number
          min_amount?: number
          max_amount?: number
          priority?: number
          status?: AccountStatus
          assigned_merchant_ids?: string[]
          notes?: string | null
          reset_at?: string | null
          updated_at?: string
        }
      }

      transactions: {
        Row: {
          id: string
          transaction_id: string
          merchant_id: string
          merchant_order_id: string | null
          checkout_token: string
          customer_name: string | null
          customer_phone: string | null
          amount: number
          currency: string
          type: TransactionType
          method_code: string
          assigned_account_id: string | null
          sender_name: string | null
          sender_phone: string | null
          transfer_reference: string | null
          proof_url: string | null
          status: TransactionStatus
          fees: number
          net_amount: number | null
          callback_url: string | null
          success_url: string | null
          fail_url: string | null
          decline_reason: string | null
          ip_address: string | null
          expires_at: string
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          merchant_id: string
          merchant_order_id?: string | null
          checkout_token: string
          customer_name?: string | null
          customer_phone?: string | null
          amount: number
          currency?: string
          type?: TransactionType
          method_code: string
          assigned_account_id?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          transfer_reference?: string | null
          proof_url?: string | null
          status?: TransactionStatus
          fees?: number
          net_amount?: number | null
          callback_url?: string | null
          success_url?: string | null
          fail_url?: string | null
          decline_reason?: string | null
          ip_address?: string | null
          expires_at?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          assigned_account_id?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          transfer_reference?: string | null
          proof_url?: string | null
          status?: TransactionStatus
          fees?: number
          net_amount?: number | null
          decline_reason?: string | null
          approved_by?: string | null
          approved_at?: string | null
          updated_at?: string
        }
      }

      transaction_events: {
        Row: {
          id: string
          transaction_id: string
          old_status: TransactionStatus | null
          new_status: TransactionStatus
          note: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          old_status?: TransactionStatus | null
          new_status: TransactionStatus
          note?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: never
      }

      raw_events: {
        Row: {
          id: string
          source: RawEventSource
          provider: string | null
          raw_payload: Json
          parsed_payload: Json | null
          matched_transaction_id: string | null
          status: RawEventStatus
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source: RawEventSource
          provider?: string | null
          raw_payload: Json
          parsed_payload?: Json | null
          matched_transaction_id?: string | null
          status?: RawEventStatus
          error_message?: string | null
          created_at?: string
        }
        Update: {
          parsed_payload?: Json | null
          matched_transaction_id?: string | null
          status?: RawEventStatus
          error_message?: string | null
        }
      }

      wallet_allocations: {
        Row: {
          id: string
          transaction_id: string
          payment_account_id: string
          amount: number
          status: AllocationStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          payment_account_id: string
          amount: number
          status?: AllocationStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: AllocationStatus
          updated_at?: string
        }
      }

      settlements: {
        Row: {
          id: string
          merchant_id: string
          period_start: string
          period_end: string
          gross_amount: number
          fees_amount: number
          net_amount: number
          currency: string
          status: SettlementStatus
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          period_start: string
          period_end: string
          gross_amount?: number
          fees_amount?: number
          net_amount?: number
          currency?: string
          status?: SettlementStatus
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          gross_amount?: number
          fees_amount?: number
          net_amount?: number
          status?: SettlementStatus
          notes?: string | null
          updated_at?: string
        }
      }

      settlement_items: {
        Row: {
          id: string
          settlement_id: string
          transaction_id: string
          amount: number
          fee: number
          net: number
        }
        Insert: {
          id?: string
          settlement_id: string
          transaction_id: string
          amount: number
          fee?: number
          net: number
        }
        Update: never
      }

      callbacks: {
        Row: {
          id: string
          transaction_id: string
          merchant_id: string
          url: string
          payload: Json
          response_status: number | null
          response_body: string | null
          status: CallbackStatus
          retry_count: number
          next_retry_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          merchant_id: string
          url: string
          payload: Json
          response_status?: number | null
          response_body?: string | null
          status?: CallbackStatus
          retry_count?: number
          next_retry_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          response_status?: number | null
          response_body?: string | null
          status?: CallbackStatus
          retry_count?: number
          next_retry_at?: string | null
          updated_at?: string
        }
      }

      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          table_name: string
          record_id: string
          old_data: Json
          new_data: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          table_name: string
          record_id: string
          old_data?: Json
          new_data?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: never
      }

      fees_rules: {
        Row: {
          id: string
          merchant_id: string | null
          method_code: string | null
          transaction_type: TransactionType | null
          fee_type: FeeType
          fee_value: number
          min_fee: number
          max_fee: number | null
          status: MethodStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id?: string | null
          method_code?: string | null
          transaction_type?: TransactionType | null
          fee_type?: FeeType
          fee_value?: number
          min_fee?: number
          max_fee?: number | null
          status?: MethodStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          method_code?: string | null
          transaction_type?: TransactionType | null
          fee_type?: FeeType
          fee_value?: number
          min_fee?: number
          max_fee?: number | null
          status?: MethodStatus
          updated_at?: string
        }
      }

      notifications: {
        Row: {
          id: string
          user_id: string | null
          merchant_id: string | null
          title: string
          title_ar: string | null
          body: string
          body_ar: string | null
          type: string
          metadata: Json
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          merchant_id?: string | null
          title: string
          title_ar?: string | null
          body: string
          body_ar?: string | null
          type?: string
          metadata?: Json
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
    }

    Views: {
      [_ in never]: never
    }

    Functions: {
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: UserRole
      }
      get_my_merchant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_operator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_transaction_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_checkout_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      hash_api_key: {
        Args: { p_key: string }
        Returns: string
      }
    }

    Enums: {
      user_role: UserRole
      merchant_status: MerchantStatus
      payment_method_type: PaymentMethodType
      account_status: AccountStatus
      transaction_type: TransactionType
      transaction_status: TransactionStatus
      raw_event_source: RawEventSource
      raw_event_status: RawEventStatus
      fee_type: FeeType
      settlement_status: SettlementStatus
      callback_status: CallbackStatus
      key_status: KeyStatus
      method_status: MethodStatus
      allocation_status: AllocationStatus
    }
  }
}

// ============================================================
// CONVENIENCE TYPE ALIASES
// ============================================================

type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Profile          = Tables<'profiles'>
export type Merchant         = Tables<'merchants'>
export type MerchantApiKey   = Tables<'merchant_api_keys'>
export type PaymentMethod    = Tables<'payment_methods'>
export type PaymentAccount   = Tables<'payment_accounts'>
export type Transaction      = Tables<'transactions'>
export type TransactionEvent = Tables<'transaction_events'>
export type RawEvent         = Tables<'raw_events'>
export type WalletAllocation = Tables<'wallet_allocations'>
export type Settlement       = Tables<'settlements'>
export type SettlementItem   = Tables<'settlement_items'>
export type Callback         = Tables<'callbacks'>
export type AuditLog         = Tables<'audit_logs'>
export type FeesRule         = Tables<'fees_rules'>
export type Notification     = Tables<'notifications'>

// ============================================================
// SAFE / PUBLIC TYPES (no sensitive fields)
// ============================================================

// Returned by get-checkout Edge Function — hides wallet internals
export type CheckoutData = {
  transaction_id: string
  merchant_name: string
  merchant_logo?: string | null
  amount: number
  currency: string
  type: TransactionType
  method_code: string
  method_name: string
  method_name_ar: string | null
  status: TransactionStatus
  expires_at: string
  checkout_token: string
}

// Safe account info returned to checkout page (hides full number)
export type SafeAccountDetails = {
  provider: string
  masked_account: string      // e.g. 0100****1111
  account_name: string
  instructions_en: string
  instructions_ar: string
}

// Merchant API response types
export type CreatePaymentResponse = {
  success: boolean
  transaction_id: string
  checkout_token: string
  checkout_url: string
  status: TransactionStatus
  expires_at: string
}

export type TransactionStatusResponse = {
  transaction_id: string
  merchant_order_id: string | null
  amount: number
  currency: string
  type: TransactionType
  method: string
  status: TransactionStatus
  created_at: string
  updated_at: string
}

// Admin live queue row
export type LiveQueueItem = Transaction & {
  merchant_name: string
  assigned_account_provider: string | null
  assigned_account_masked: string | null
  raw_event?: RawEvent | null
}
