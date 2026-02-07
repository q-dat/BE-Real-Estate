import { Document, Schema, model } from 'mongoose'

export interface IRentalPriceUnit extends Document {
  displayName: string
  description?: string
}

const RentalPriceUnitSchema: Schema = new Schema<IRentalPriceUnit>(
  {
    displayName: { type: String, required: true },
    description: { type: String }
  },
  { timestamps: true, collection: 'rental-price-units' }
)

export const RentalPriceUnitModel = model<IRentalPriceUnit>('RentalPriceUnitModel', RentalPriceUnitSchema)
