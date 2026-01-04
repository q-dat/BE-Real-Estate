import { Request, Response } from 'express'
import mongoose from 'mongoose'
import RentalPostAdminModel from '~/api/models/rental/rentalPostAdminModel'

export const getAllRentalPostsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // if (isBrowserRequest(req)) {
    //   res.send('')
    //   return
    // }
    const {
      catalogID,
      categoryCode,
      title,
      code,

      price,
      priceFrom,
      priceTo,

      area,
      areaFrom,
      areaTo,

      pricePerM2From,
      pricePerM2To,

      province,
      district,
      ward,

      propertyType,
      locationType,
      direction,
      legalStatus,
      furnitureStatus,

      bedroomNumber,
      toiletNumber,
      floorNumber,

      postType,
      status,
      author
    } = req.query

    const filters: Record<string, unknown> = {}

    /* ---------- Text search ---------- */
    if (title) {
      filters.title = { $regex: String(title), $options: 'i' }
    }
    if (code) {
      filters.code = { $regex: String(code), $options: 'i' }
    }
    /* ---------- Price ---------- */
    if (priceFrom || priceTo) {
      filters.price = {
        ...(priceFrom && { $gte: Number(priceFrom) }),
        ...(priceTo && { $lte: Number(priceTo) })
      }
    } else if (price) {
      filters.price = { $lte: Number(price) }
    }

    /* ---------- Area ---------- */
    if (areaFrom || areaTo) {
      filters.area = {
        ...(areaFrom && { $gte: Number(areaFrom) }),
        ...(areaTo && { $lte: Number(areaTo) })
      }
    } else if (area) {
      filters.area = { $gte: Number(area) }
    }

    /* ---------- Price per m2 ---------- */
    if (pricePerM2From || pricePerM2To) {
      filters.pricePerM2 = {
        ...(pricePerM2From && { $gte: Number(pricePerM2From) }),
        ...(pricePerM2To && { $lte: Number(pricePerM2To) })
      }
    }

    /* ---------- Location ---------- */
    if (province) {
      filters.province = { $regex: String(province), $options: 'i' }
    }

    if (district) {
      const normalizedDistrict = String(district).trim().toLowerCase()
      filters.$expr = {
        $eq: [{ $toLower: '$district' }, normalizedDistrict]
      }
    }

    if (ward) {
      filters.ward = { $regex: String(ward), $options: 'i' }
    }

    /* ---------- Property attributes ---------- */
    if (propertyType) filters.propertyType = propertyType
    if (locationType) filters.locationType = locationType
    if (direction) filters.direction = direction
    if (legalStatus) filters.legalStatus = legalStatus
    if (furnitureStatus) filters.furnitureStatus = furnitureStatus

    if (bedroomNumber) filters.bedroomNumber = Number(bedroomNumber)
    if (toiletNumber) filters.toiletNumber = Number(toiletNumber)
    if (floorNumber) filters.floorNumber = Number(floorNumber)

    /* ---------- Post meta ---------- */
    if (postType) filters.postType = postType
    if (status) filters.status = status
    if (author) filters.author = author

    /* ---------- Category match ---------- */
    const categoryMatch: Record<string, unknown> = {}

    if (catalogID) {
      categoryMatch['category._id'] = new mongoose.Types.ObjectId(String(catalogID))
    }

    if (categoryCode) {
      categoryMatch['category.categoryCode'] = Number(categoryCode)
    }

    const rentalPosts = await RentalPostAdminModel.aggregate([
      {
        $lookup: {
          from: 'rental-categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      { $match: categoryMatch },
      { $match: filters }
    ])

    const count = await RentalPostAdminModel.countDocuments(filters)

    res.status(200).json({
      message: rentalPosts.length ? 'Lấy danh sách bài đăng thành công' : 'Không có bài đăng phù hợp',
      count,
      visibleCount: rentalPosts.length,
      rentalPosts
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Lỗi máy chủ',
      error: error.message
    })
  }
}

/**
 * ================================
 * QUERY FILTERS – RENTAL POST ADMIN
 * ================================
 *
 * 1. TÌM KIẾM CƠ BẢN
 * ------------------------------------------------
 * title?: string
 *   - Tìm theo tiêu đề bài đăng
 *   - Search không phân biệt hoa thường
 * code: string
 *   - Tìm mã bài đăng
 *
 * 2. DANH MỤC / CATEGORY
 * ------------------------------------------------
 * catalogID?: string
 *   - ObjectId của danh mục cha
 *
 * categoryCode?: number
 *   - Mã danh mục (numeric code)
 *
 *
 * 3. GIÁ (VNĐ)
 * ------------------------------------------------
 * price?: number
 *   - Lọc bài có giá <= price
 *
 * priceFrom?: number
 *   - Giá tối thiểu
 *
 * priceTo?: number
 *   - Giá tối đa
 *
 *
 * 4. DIỆN TÍCH (m2)
 * ------------------------------------------------
 * area?: number
 *   - Diện tích >= area
 *
 * areaFrom?: number
 *   - Diện tích tối thiểu
 *
 * areaTo?: number
 *   - Diện tích tối đa
 *
 *
 * 5. GIÁ TRÊN M2
 * ------------------------------------------------
 * pricePerM2From?: number
 *   - Giá / m2 tối thiểu
 *
 * pricePerM2To?: number
 *   - Giá / m2 tối đa
 *
 *
 * 6. VỊ TRÍ ĐỊA LÝ
 * ------------------------------------------------
 * province?: string
 *   - Tỉnh / Thành phố
 *
 * district?: string
 *   - Quận / Huyện
 *   - So sánh chính xác, không phân biệt hoa thường
 *
 * ward?: string
 *   - Phường / Xã
 *
 *
 * 7. LOẠI HÌNH BẤT ĐỘNG SẢN
 * ------------------------------------------------
 * propertyType?: string
 *   - Ví dụ:
 *     - "Căn hộ"
 *     - "Nhà phố"
 *     - "Đất nền"
 *
 * locationType?: string
 *   - Ví dụ:
 *     - "Mặt tiền"
 *     - "Hẻm"
 *
 *
 * 8. THUỘC TÍNH NHÀ ĐẤT
 * ------------------------------------------------
 * direction?: string
 *   - Hướng nhà (Đông, Tây, Nam, Bắc...)
 *
 * legalStatus?: string
 *   - Pháp lý
 *   - Ví dụ: "Sổ đỏ", "Sổ hồng"
 *
 * furnitureStatus?: string
 *   - Tình trạng nội thất
 *   - Ví dụ: "Đầy đủ", "Cơ bản", "Không có"
 *
 *
 * 9. SỐ LƯỢNG PHÒNG
 * ------------------------------------------------
 * bedroomNumber?: number
 *   - Số phòng ngủ
 *
 * toiletNumber?: number
 *   - Số toilet
 *
 * floorNumber?: number
 *   - Số tầng
 *
 *
 * 10. TRẠNG THÁI BÀI ĐĂNG
 * ------------------------------------------------
 * postType?: 'basic' | 'vip1' | 'vip2' | 'vip3' | 'highlight'
 *   - Loại tin đăng
 *
 * status?: 'active' | 'pending' | 'expired' | 'hidden'
 *   - Trạng thái bài đăng
 *
 *
 * 11. NGƯỜI ĐĂNG
 * ------------------------------------------------
 * author?: string
 *   - Người tạo bài đăng
 *
 *
 * 12. KẾT HỢP FILTER
 * ------------------------------------------------
 * - Có thể kết hợp nhiều query cùng lúc
 * - Các filter dạng range sẽ ưu tiên hơn filter đơn lẻ
 *
 *
 * 13. VÍ DỤ REQUEST
 * ------------------------------------------------
 * /admin/rental-posts?
 *   province=Hồ Chí Minh&
 *   district=Quận 7&
 *   ward=Tân Phú&
 *   priceFrom=5000000&
 *   priceTo=15000000&
 *   areaFrom=30&
 *   postType=vip1&
 *   status=active
 */
