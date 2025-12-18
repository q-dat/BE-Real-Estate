import { Request, Response } from 'express'
import RealEstateProjectModel from '~/api/models/realEstateProject/realEstateProjectModel'

export const createRealEstateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      introduction,
      description,
      article,
      pricing,
      status,
      projectType,
      area,
      investor,
      partners,
      location,
      amenities,
      hotline,
      email,
      zalo,
      message
    } = req.body

    if (!name || !slug) {
      res.status(400).json({ message: 'Name và slug là bắt buộc!' })
      return
    }

    const existed = await RealEstateProjectModel.findOne({ slug })
    if (existed) {
      res.status(409).json({ message: 'Slug đã tồn tại!' })
      return
    }

    const project = new RealEstateProjectModel({
      name,
      slug,
      introduction,
      description,
      article,
      pricing,
      status,
      projectType,
      area,
      investor,
      partners,
      location,
      amenities,
      hotline,
      email,
      zalo,
      message
    })

    const saved = await project.save()

    res.status(201).json({
      message: 'Tạo dự án bất động sản thành công!',
      data: saved
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ!', error: err.message })
  }
}
