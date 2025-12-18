import { Request, Response } from 'express'
import RealEstateProjectModel from '~/api/models/realEstateProject/realEstateProjectModel'

export const getAllRealEstateProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, projectType, investor } = req.query

    const filters: Record<string, unknown> = {}

    if (status) filters.status = status
    if (projectType) filters.projectType = projectType
    if (investor) filters.investor = investor

    const projects = await RealEstateProjectModel.find(filters)
      .sort({ createdAt: -1 })
      .lean()

    const count = await RealEstateProjectModel.countDocuments(filters)

    res.status(200).json({
      message: projects.length ? 'Lấy danh sách dự án thành công!' : 'Không có dự án nào!',
      count,
      projects
    })
  } catch (error: unknown) {
    const err = error as Error
    res.status(500).json({ message: 'Lỗi máy chủ!', error: err.message })
  }
}
