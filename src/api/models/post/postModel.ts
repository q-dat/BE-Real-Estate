import { Schema, model, Types, Document } from 'mongoose'

export interface IPost extends Document {
  image?: string
  title: string
  slug?: string
  content: string
  catalog: Types.ObjectId
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    image: { type: String },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    content: { type: String, required: true },
    catalog: { type: Schema.Types.ObjectId, ref: 'PostCategoryModel', required: true },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
)

PostSchema.index({ title: 'text', content: 'text' })

export const PostModel = model<IPost>('Post', PostSchema)
