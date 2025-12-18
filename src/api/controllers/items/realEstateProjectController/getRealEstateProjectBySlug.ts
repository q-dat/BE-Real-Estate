import { Request, Response } from 'express'
import RealEstateProjectModel from '~/api/models/realEstateProject/realEstateProjectModel'

export const getRealEstateProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await RealEstateProjectModel.findOne({ slug: req.params.slug }).lean()

    if (!project) {
      res.status(404).json({ message: 'Dự án không tồn tại!' })
      return
    }

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600')
    res.status(200).json({
      message: 'Lấy dự án theo slug thành công!',
      project
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ!', error: err.message })
  }
}
