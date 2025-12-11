import mongoose, { Schema, Document } from 'mongoose'

/**
 * RentalCategory - Danh mục loại hình cho thuê
 */
export interface IRentalCategory extends Document {
  _id: string // id danh mục (ObjectId)
  name: string // tên hiển thị (vd: "Cho thuê căn hộ")
  categoryCode: number // mã danh mục (vd: 1, 2, 3...)
  description?: string // mô tả danh mục
  createdAt: string // ngày tạo danh mục
  updatedAt: string // ngày cập nhật danh mục
}

const RentalCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    categoryCode: { type: Number, required: true, unique: true },
    description: { type: String }
  },
  { timestamps: true, collection: 'rental-categories' }
)
const RentalCategoryModel = mongoose.model<IRentalCategory>('RentalCategoryModel', RentalCategorySchema)
export default RentalCategoryModel
