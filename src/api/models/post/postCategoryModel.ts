import { Schema, model, Document } from 'mongoose'

export interface IPostCategory extends Document {
  name: string
  slug?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const PostCategorySchema = new Schema<IPostCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true },
    description: { type: String }
  },
  { timestamps: true, collection: 'post-categories' }
)

export const PostCategoryModel = model<IPostCategory>('PostCategoryModel', PostCategorySchema)
