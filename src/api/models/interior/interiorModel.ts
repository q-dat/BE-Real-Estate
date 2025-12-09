import mongoose, { Document, Schema } from 'mongoose'

export interface IInterior extends Document {
  _id: string
  name: string
  images: string
  thumbnail?: string[]
  status?: string
  description?: string
}

const InteriorSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    images: { type: String, required: true },
    thumbnail: { type: [String], default: [] },
    status: { type: String },
    description: { type: String }
  },
  { timestamps: true, collection: 'interior' }
)

const InteriorModel = mongoose.model<IInterior>('Interior', InteriorSchema)

export default InteriorModel
