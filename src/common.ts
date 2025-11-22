export const USER_MAP = {
  '407764427259757': '1000034001', //'Nguyễn Diệu Linh',
  '122139384938469583': '1000033954', //'Trần Thị Ngọc Hiên',
  '122229301970009916': '1000033951', //'Âu Thị Hồng Hạnh',
  '122099831474851971': '1000033993', //'Đồng thị Quỳnh Trang',
  '356899340356397': '1000048930',
};

export const USER_FULLNAME_MAP = {
  '407764427259757': 'Nguyễn Diệu Linh',
  '122139384938469583': 'Trần Thị Ngọc Hiên',
  '122229301970009916': 'Âu Thị Hồng Hạnh',
  '122099831474851971': 'Đồng thị Quỳnh Trang',
  '356899340356397': 'Nguyễn Thị Hồng Nhung',
};

export const PAGE_MAP = {
  '288692354317284': '1000033943', //'Trần Văn Ka',
  '109202400560580': '1000033943', //'Trần Văn Ka',
  '393270173861271': '1000033943', // 'Trần Văn Ka',
  '1839941659666996': '1000033943', //'Trần Văn Ka',

  '742024272324949': '1000033943', //'Trần Văn Ka',
  '717858274742648': '1000033943', //'Trần Văn Ka',
};

export const STATUS_MAP = {
  request_received: 1, // Mới - Chờ xử lý
  out_for_delivery: 2, // Đang giao hàng - Đang giao hàng
  delivered: 3, // Giao thành công - Giao thành công
  returning: 4, // Đang hoàn - Đang chuyển hoàn
  returned: 5, // Đã hoàn - Đã chuyển hoàn
  canceled: 6, // Đã hủy - Đã hủy
  picking_up: 7, //  Đang lấy hàng - Đang lấy hàng
  // '': 8, // Chờ lấy lại
  picked_up: 9, // Đã lấy hàng - Đã lấy hàng
  on_the_way: 9, // Đã gửi hàng - Đã lấy hàng
  // '': 10, // Chờ giao lại
  waiting_for_return: 11, //  Chờ chuyển hoàn - Chờ chuyển hoàn
  '': 12, //  - Chờ chuyển hoàn lại.
};
