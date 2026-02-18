import { Request, Response } from 'express';
import { PostModel } from '~/api/models/post/postModel';

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        message: 'Slug không hợp lệ'
      });
    }

    const post = await PostModel.findOne({ slug })
      .populate('catalog', '-createdAt -updatedAt -__v')
      .lean();

    if (!post) {
      return res.status(404).json({
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      message: 'Lấy bài viết thành công',
      post
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};
