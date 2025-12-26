import mongoose, { Document, Schema } from 'mongoose'
import { IInteriorCategory } from './interiorCategoryModel'

export interface IInterior extends Document {
  _id: string
  name: string
  category: IInteriorCategory
  images: string
  thumbnails?: string[]
  status?: string
  description?: string
  content?: string
}

const InteriorSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'InteriorCategoryModel', required: true },
    images: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    status: { type: String },
    description: { type: String },
    content: { type: String }
  },
  { timestamps: true, collection: 'interior' }
)

const InteriorModel = mongoose.model<IInterior>('InteriorModel', InteriorSchema)

export default InteriorModel
