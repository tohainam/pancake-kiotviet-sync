export type PancakeOrder = {
  bill_full_name: string;
  prepaid: number;
  is_live_shopping: boolean;
  time_assign_seller: string;
  money_to_collect: number;
  page: {
    id: string;
    name: string;
    username: string;
  };
  status: number;
  pke_mkter: any;
  bill_email: any;
  marketplace_id: any;
  items: Array<{
    added_to_cart_quantity: number;
    components: any;
    composite_item_id: any;
    discount_each_product: number;
    exchange_count: number;
    id: number;
    is_bonus_product: boolean;
    is_composite: boolean;
    is_discount_percent: boolean;
    is_wholesale: boolean;
    measure_group_id: any;
    note: any;
    note_product: string;
    one_time_product: boolean;
    product_id: string;
    quantity: number;
    return_quantity: number;
    returned_count: number;
    returning_quantity: number;
    same_price_discount: number;
    total_discount: number;
    variation_id: string;
    variation_info: {
      barcode: string;
      brand_id: any;
      category_ids: Array<any>;
      detail: any;
      display_id: string;
      exact_price: any;
      fields: Array<any>;
      images: Array<string>;
      last_imported_price: number;
      measure_info: any;
      name: string;
      product_display_id: string;
      retail_price: number;
      retail_price_original: any;
      tax_rate: any;
      weight: number;
    };
  }>;
  ads_source: string;
  return_fee: boolean;
  account_name: string;
  account: string;
  inserted_at: string;
  note_image: any;
  order_currency: string;
  note: string;
  cod: number;
  activated_promotion_advances: Array<any>;
  returned_reason_name: any;
  prepaid_by_point: {
    money: number;
    point: number;
  };
  type: string;
  system_id: number;
  total_price_after_sub_discount: number;
  p_utm_medium: any;
  page_id: string;
  customer: {
    order_count: number;
    customer_id: string;
    gender: any;
    conversation_tags: any;
    name: string;
    notes: Array<any>;
    purchased_amount: number;
    succeed_order_count: number;
    returned_order_count: number;
    inserted_at: string;
    current_debts: number;
    count_referrals: number;
    is_discount_by_level: boolean;
    phone_numbers: Array<string>;
    id: string;
    used_reward_point: number;
    list_voucher: Array<any>;
    is_adjust_debts: any;
    reward_point: number;
    active_levera_pay: boolean;
    date_of_birth: any;
    referral_code: string;
    tags: Array<any>;
    is_block: boolean;
    total_amount_referred: any;
    emails: Array<any>;
    user_block_id: any;
    shop_id: number;
    creator_id: string;
    username: any;
    shop_customer_addresses: Array<{
      address: string;
      commune_id: string;
      country_code: number;
      district_id: string;
      full_address: string;
      full_name: string;
      id: string;
      phone_number: string;
      post_code: any;
      province_id: string;
    }>;
    currency: string;
    assigned_user_id: string;
    level: any;
    fb_id: string;
    order_sources: Array<string>;
    last_order_at: string;
    updated_at: string;
  };
  id: number;
  is_smc: boolean;
  p_utm_term: any;
  charged_by_card: number;
  status_name: string;
  time_assign_care: any;
  charged_by_momo: number;
  p_utm_source: any;
  levera_point: number;
  link: any;
  assigning_seller_id: string;
  exchange_payment: number;
  exchange_value: number;
  change_by_orders: Array<any>;
  activated_combo_products: Array<any>;
  surcharge: number;
  order_link: string;
  returned_reason: any;
  customer_needs: Array<any>;
  p_utm_content: any;
  histories: Array<{
    amount_owed_to_customer?: {
      new: number;
      old: any;
    };
    bank_payments?: {
      new: any;
      old: any;
    };
    editor_id?: string;
    prepaid_by_point?: {
      new: {
        money: number;
        point: number;
      };
      old: any;
    };
    status?: {
      new: number;
      old: number;
    };
    surcharges?: {
      new: any;
      old: any;
    };
    updated_at: string;
    customer_pay_fee?: {
      new: boolean;
      old: any;
    };
    extend_code?: {
      new: number;
      old: any;
    };
    partner_count?: {
      new: Array<{
        id: number;
        value: number;
      }>;
      old: any;
    };
    partner_id?: {
      new: number;
      old: any;
    };
    shop_partner_id?: {
      new: number;
      old: any;
    };
    time_send_partner?: {
      new: string;
      old: any;
    };
    user_send_partner?: {
      new: string;
      old: any;
    };
    partner_fee?: {
      new: number;
      old: number;
    };
    partner_status?: {
      new: string;
      old?: string;
    };
    tags?: {
      new: Array<{
        id: number;
        name: string;
      }>;
      old: Array<{
        id: number;
        name: string;
      }>;
    };
  }>;
  tags: Array<{
    id: number;
    name: string;
  }>;
  link_confirm_order: string;
  estimate_delivery_date: any;
  p_utm_campaign: any;
  event_type: string;
  tax: number;
  order_sources_name: string;
  partner?: {
    cod: number;
    count_of_delivery: number;
    custom_partner_id: any;
    delivery_name: any;
    delivery_tel: any;
    extend_code: string;
    extend_update: Array<{
      key: string;
      location?: string;
      note: any;
      status: string;
      tracking_id: string;
      update_at: string;
      webhook_params: any;
    }>;
    first_delivery_at: string;
    is_ghn_v2: any;
    is_returned: any;
    order_id_ghn: any;
    order_number_vtp: string;
    paid_at: any;
    partner_id: number;
    partner_name: string;
    partner_status:
      | 'request_received'
      | 'out_for_delivery'
      | 'delivered'
      | 'returning'
      | 'returned'
      | 'canceled'
      | 'picking_up'
      | 'picked_up'
      | 'waiting_for_return';
    picked_up_at: string;
    printed_form: string;
    service_partner: {
      createordertime: string;
      customerid: string;
      eccompanyid: string;
      goodsvalue: number;
      height: number;
      items: Array<{
        englishName: string;
        itemname: string;
        itemvalue: number;
        number: number;
      }>;
      itemsvalue: number;
      length: number;
      logisticproviderid: string;
      ordertype: number;
      partner_id: number;
      partsign: number;
      paytype: string;
      receiver: {
        address: string;
        area: string;
        city: string;
        mobile: string;
        name: string;
        phone: string;
        prov: string;
      };
      remark: string;
      sender: {
        address: string;
        area: string;
        city: string;
        mobile: string;
        name: string;
        phone: string;
        prov: string;
      };
      servicetype: number;
      special: string;
      txlogisticid: string;
      weight: string;
      width: number;
    };
    sort_code: string;
    system_created: boolean;
    total_fee: number;
    updated_at: string;
  };
  partner_fee: number;
  botcake_info: any;
  shop_id: number;
  customer_referral_code: any;
  customer_pay_fee: boolean;
  post_id: string;
  shipping_address: {
    address: string;
    commnue_name: string;
    commune_code_sicepat: any;
    commune_id: string;
    commune_name: string;
    country_code: string;
    district_id: string;
    district_name: string;
    full_address: string;
    full_name: string;
    marketplace_address: any;
    new_commune_id: string;
    new_full_address: string;
    new_province_id: string;
    phone_number: string;
    post_code: string;
    province_id: string;
    province_name: string;
    render_type: string;
  };
  warehouse_id: string;
  assigning_care_id: any;
  advanced_platform_fee: any;
  payment_purchase_histories: Array<any>;
  is_livestream: boolean;
  total_price: number;
  warehouse_info: {
    address: string;
    affiliate_id: any;
    commune_id: string;
    custom_id: any;
    district_id: string;
    ffm_id: any;
    full_address: string;
    has_snappy_service: boolean;
    name: string;
    phone_number: string;
    postcode: any;
    province_id: string;
    settings: {
      new_id_address: {
        new_commune_id: string;
        new_province_id: string;
      };
    };
  };
  partner_account: {
    name: any;
    user_name: string;
  };
  shipping_fee: number;
  items_length: number;
  fee_marketplace: number;
  last_editor: any;
  assigning_seller: {
    avatar_url: any;
    email: string;
    fb_id: string;
    id: string;
    name: string;
    phone_number: any;
  };
  note_print: any;
  status_history: Array<{
    avatar_url: any;
    editor?: {
      avatar_url: any;
      email: string;
      fb_id: string;
      id: string;
      name: string;
      phone_number: any;
    };
    editor_fb?: string;
    editor_id?: string;
    name?: string;
    old_status?: number;
    status: number;
    updated_at: string;
  }>;
  buyer_total_amount: any;
  charged_by_qrpay: number;
  cash: number;
  total_discount: number;
  conversation_id: string;
  total_quantity: number;
  order_sources: number;
  assigning_care: any;
  is_exchange_order: boolean;
  transfer_money: number;
  time_send_partner: string;
  creator: {
    avatar_url: any;
    email: string;
    fb_id: string;
    id: string;
    name: string;
    phone_number: any;
  };
  bill_phone_number: string;
  sub_status: any;
  is_free_shipping: boolean;
  received_at_shop: boolean;
  p_utm_id: any;
  marketer: any;
  ad_id: string;
  updated_at: string;
};
