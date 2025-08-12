import { Injectable, Logger } from '@nestjs/common';
import { PancakeOrder } from 'src/types';

@Injectable()
export class PancakeService {
  private readonly logger = new Logger(PancakeService.name);

  prepareData(
    order: PancakeOrder,
  ): Pick<
    PancakeOrder,
    | 'id'
    | 'status'
    | 'customer'
    | 'items'
    | 'total_price'
    | 'partner'
    | 'shipping_address'
    | 'creator'
    | 'page_id'
  > {
    this.logger.log(
      `Preparing data for Pancake order ID: ${order.id} with status: ${order.status}`,
    );

    const id = order.id;
    const status = order.status;
    const customer = order.customer;
    const items = order.items;
    const total_price = order.total_price;
    const partner = order.partner;
    const shipping_address = order.shipping_address;
    const creator = order.creator;
    const page_id = order.page_id;

    this.logger.log(
      `Prepared data for Pancake order ID: ${id} with status: ${status} - with data - ${JSON.stringify(
        {
          id,
          status,
          customer,
          items,
          total_price,
          partner,
          shipping_address,
          creator,
          page_id,
        },
      )}`,
    );

    return {
      id,
      status,
      customer,
      items,
      total_price,
      partner,
      shipping_address,
      creator,
      page_id,
    };
  }
}
