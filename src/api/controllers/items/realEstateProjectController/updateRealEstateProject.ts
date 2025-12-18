import { Request, Response } from 'express'
import RealEstateProjectModel from '~/api/models/realEstateProject/realEstateProjectModel'

export const updateRealEstateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData: Record<string, unknown> = { ...req.body }

    const updated = await RealEstateProjectModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!updated) {
      res.status(404).json({ message: 'Không tìm thấy dự án!' })
      return
    }

    res.status(200).json({
      message: 'Cập nhật dự án thành công!',
      data: updated
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ!', error: err.message })
  }
}
