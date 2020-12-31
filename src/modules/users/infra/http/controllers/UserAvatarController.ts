import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UserMap from '@mappers/UserMap';
import UpdateUserAvatarServices from '@modules/users/services/UpdateUserAvatarServices';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const updateUserAvatar = container.resolve(UpdateUserAvatarServices);

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        const mappedUser = UserMap.toDTO(user);

        return response.json(classToClass(mappedUser));
    }
}
