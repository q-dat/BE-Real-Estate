import { Response, Request } from 'express'
import { PostCategoryModel } from '~/api/models/post/postCategoryModel'

export const getPostCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const postCategory = await PostCategoryModel.findById(req.params.id).lean()

    if (!postCategory) {
      res.status(404).json({ message: 'Danh mục không tồn tại!' })
      return
    }

    res.status(200).json({
      message: 'Lấy danh mục theo id thành công!',
      postCategory
    })
  } catch (error: any) {
    console.error('Lỗi trong getPostCategoryById:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message })
  }
}
