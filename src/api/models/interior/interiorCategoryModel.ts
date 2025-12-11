import mongoose, { Document, Schema } from 'mongoose'

export interface IInteriorCategory extends Document {
  name: string
  categoryCode?: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

const InteriorCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    categoryCode: { type: Number },
    description: { type: String }
  },
  {
    timestamps: true,
    collection: 'interior_categories'
  }
)

const InteriorCategoryModel = mongoose.model<IInteriorCategory>('InteriorCategoryModel', InteriorCategorySchema)

export default InteriorCategoryModel
