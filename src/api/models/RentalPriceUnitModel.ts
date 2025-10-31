import { Document, Schema, model } from 'mongoose'

export interface IRentalPriceUnit extends Document {
  _id: string
  code: string // code định danh (vd: 'million_per_month')
  displayName: string // tên hiển thị cho người dùng (vd: 'Triệu/tháng')
  multiplier: number // hệ số nhân (vd: 1_000_000 hoặc 1_000)
  description?: string
  order?: number
  isActive: boolean
}

const RentalPriceUnitSchema = new Schema<IRentalPriceUnit>(
  {
    code: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    multiplier: { type: Number, required: true }, // 1_000 / 1_000_000
    description: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, collection: 'rental-price-units' }
)

export const RentalPriceUnitModel = model<IRentalPriceUnit>('RentalPriceUnitModel', RentalPriceUnitSchema)
