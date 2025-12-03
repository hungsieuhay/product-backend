import { UserService } from '../service/user.service';
import { Request, Response } from 'express';

export class UserController {
  static async getUsers(req: Request, res: Response): Promise<void> {
    const result = await UserService.getUsers();

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.status(200).json(result);
  }
}
